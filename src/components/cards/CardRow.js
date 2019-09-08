import React, { Component } from "react";
import ShopLoyalCardLogo from "../../resources/img/ShopLoyalLogoIcon.png";
import ScrollMenu from "react-horizontal-scrolling-menu";
import Card from "./Card";
import PromoCard from "../notices/PromoCard";
import API from "../../utils/API";
import { connect } from "react-redux";
import { withKeycloak } from "react-keycloak";
import Hammer from "hammerjs";

function loadJSONIntoUI(data) {
  if (!(data instanceof Array)) {
    data = [data];
  }

  return data;
}

class CardRow extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      search: "",
      list: [],
      isLoading: true,
      bubblemsg: null,
      animationEnded: false,
      transformInitial: null,
      onCard: 0,
      swipeTimeDiff: 0
    };
    this.menu = null;
    this.animationend = this.animationend.bind(this);
  }

  containerRef = React.createRef();
  scrollRef = React.createRef();

  configuration = data => {
    data = loadJSONIntoUI(data);
    data.forEach(promo => {
      this.state.list.push(
        <PromoCard
          data={promo}
          key={promo.id}
          merchant_id={this.props.merchant.merchant.id}
        />
      );
    });

    this.setState({ data, isLoading: false });
  };

  merchantMessageConfiguration(data) {
    let msg;
    let text_msg;
    // Leaving the loop for now - can probably remove once we're certain Julie wants to keep last message
    for (let el of data) {
      if (el.recipient === "customer") {
        text_msg = el.message;
        msg = el;
        break;
      }
    }
    this.setState({ bubblemsg: text_msg, bubbleid: msg.merchantId });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextState.animationEnded === this.state.animationEnded &&
      this.state.animationEnded === true
    ) {
      return false;
    }
    return true;
  }

  componentDidMount() {

    // This is messy due to switchover from , re-architect

    if (this.props.keycloak.authenticated /*&& this.props.count == 0*/) {
      let merchant_id = this.props.merchant.merchant.id;
      let api = new API(this.props.keycloak);
      let self = this;
      api.setRetry(10);
      api
        .get("merchantMessages", { repl_str: merchant_id })
        .then(response => this.merchantMessageConfiguration(response.data))
        .catch(function (error) {
          console.log(error);
        })
        .finally(function () {
          self.state.list.push(
            <Card
              merchant={self.props.merchant.merchant}
              key={self.props.merchant.merchant.id}
              bubblemsg={self.state.bubblemsg}
            />
          );
        })
        .finally(function () {
          let api = new API(self.props.keycloak);
          let query = {
            lat: self.props.coordinates.coords.latitude,
            lng: self.props.coordinates.coords.longitude,
            radius: "10.0",
            limit: "30",
            search: self.props.category.category,
            value: self.props.search.search
          };
          api
            .get("merchantNoticesAPI", {
              repl_str: self.props.merchant.merchant.id,
              query: query
            })
            .then(response => self.configuration(response.data))
            .catch(function (error) {
              console.log(error);
            });
        });
    }

    window.addEventListener("scroll", function () { });
  }

  componentWillMount() {
    if (this.props.merchant.merchant.id === 0) {
      // Uses keycloak info rather than profile, as Keycloak will absolutely be loaded, but this possibly should be
      // re-written to use profile
      this.setState({
        bubblemsg:
          "Hey " +
          this.props.keycloak.idTokenParsed.given_name +
          ", Welcome to ShopLoyal! Swipe to learn more!",
        bubbleid: 0
      });
    }
  }

  swipeRight() {
    if (
      this.state.onCard > 0 &&
      Math.abs(this.state.swipeTimeDiff - Date.now()) > 250
    ) {
      this.setState({ onCard: this.state.onCard - 1 });
      let fontSize = parseFloat(
        getComputedStyle(document.documentElement).fontSize
      );
      let menuWrapper = document.querySelectorAll(".menu-wrapper--inner")[
        this.props.count
      ];
      let threeDVal = Number(
        String(menuWrapper.style.transform)
          .split("(")
          .pop()
          .split("px,")[0]
      );
      let transformSize = fontSize * 30 + threeDVal;
      let fullTransformSize = convertRemToPixels(4.5) + transformSize;
      let translate3d = "translate3d(" + fullTransformSize + "px, 0px, 0px)";
      this.setState({ swipeTimeDiff: Date.now() });
      menuWrapper.style.transform = translate3d;
    }
  }
  swipeLeft() {
    if (
      this.state.onCard + 1 < this.state.list.length &&
      Math.abs(this.state.swipeTimeDiff - Date.now()) > 250
    ) {
      this.setState({ onCard: this.state.onCard + 1 });
      let fontSize = parseFloat(
        getComputedStyle(document.documentElement).fontSize
      );
      let menuWrapper = document.querySelectorAll(".menu-wrapper--inner")[
        this.props.count
      ];
      let threeDVal = Number(
        String(menuWrapper.style.transform)
          .split("(")
          .pop()
          .split("px,")[0]
      );
      let transformSize = fontSize * 30 - threeDVal;
      let fullTransformSize = convertRemToPixels(4.5) + transformSize;
      let translate3d = "translate3d(" + -fullTransformSize + "px, 0px, 0px)";

      this.setState({ swipeTimeDiff: Date.now() });
      menuWrapper.style.transform = translate3d;
    }
  }

  componentDidUpdate() {
    // TODO: Figure out how to fix this lifecycle method
    if (this.containerRef.current !== null && this.menu.current !== null) {
      this.hammer = Hammer(this.containerRef.current);
      this.hammer.get("swipe").set({ threshold: 100, velocity: 0.7 });
      this.hammer.on("swiperight", () => this.swipeRight());
      this.hammer.on("swipeleft", () => this.swipeLeft());
    }
  }

  animationend() {
    if (this.state.transformInitial === null) {
      let menuWrapper = document.querySelectorAll(".menu-wrapper--inner")[
        this.props.count
      ];
      this.setState({ transformInitial: menuWrapper.style.transform });
    }
    this.setState({ animationEnded: true });
  }

  render() {
    if (this.state.isLoading) {
      return <div />;
    }

    const menu = this.state.list;
    let translate = 0;

    if (this.state.bubblemsg && this.state.animationEnded) {
      translate = convertRemToPixels(4.5);
    }

    return (
      <div
        className={
          "App slide-up-card card-row card-color " + this.props.className
        }
        ref={this.containerRef}
        onAnimationEnd={this.animationend}
      >
        <ScrollMenu
          data={this.state.list}
          inertiaScrolling={true}
          dragging={false}
          transition={0.2}
          scrollBy={1}
          inertiaScrollingSlowdown={0.9}
          ref={el => (this.menu = el)}
          translate={translate}
          alignCenter={true}
          onUpdate={this.scrollMenuUpdate}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    search: state.search,
    coordinates: state.coordinates,
    category: state.categories,
    profile: state.profile
  };
};

export default connect(mapStateToProps)(withKeycloak(CardRow));

function convertRemToPixels(rem) {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}
