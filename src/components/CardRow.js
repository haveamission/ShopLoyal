import React, { Component } from "react";
import ShopLoyalCardLogo from "../img/ShopLoyalLogoIcon.png";
import ScrollMenu from "react-horizontal-scrolling-menu";
import Card from "./Card";
import PromoCard from "./PromoCard";
//import withFetching from "./API";
import API from "./API";
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

  createIntro() {
    const promo1 = {
      id: -1,
      ...this.props.merchant,
      photo: ShopLoyalCardLogo,
      title: "These are promotion cards",
      text:
        "Bring these to your local merchants to redeem promotions or rewards!"
    };
    const promo2 = {
      id: -2,
      ...this.props.merchant,
      photo: ShopLoyalCardLogo,
      title: "Start adding your favorite stores",
      text:
        "'Search' up top for your local merchants and 'Favorite' ♥ them to begin receiving personalized promotions and updates!"
    };

    this.state.list.push(
      <Card
        merchant={this.props.merchant.merchant}
        key={this.props.merchant.merchant.id}
        bubblemsg={this.state.bubblemsg}
      />
    );
    this.state.list.push(
      <PromoCard
        data={promo1}
        key={promo1.id}
        merchant_id={this.props.merchant.merchant.id}
      />
    );
    this.state.list.push(
      <PromoCard
        data={promo2}
        key={promo2.id}
        merchant_id={this.props.merchant.merchant.id}
      />
    );
    this.setState({ isLoading: false });
    // Switch into a string repo with string formatting after MVP
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
        text_msg = "From: " + el.message;
        msg = el;
        break;
      } else if (el.recipient === "merchant") {
        text_msg = "To: " + el.message;
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
    if (this.props.keycloak.authenticated) {
      //
      if (this.props.merchant.merchant.id === 0) {
        this.createIntro();
        return;
      }
    }

    // This is messy due to switchover from , re-architect

    if (this.props.keycloak.authenticated /*&& this.props.count == 0*/) {
      var merchant_id = this.props.merchant.merchant.id;
      var api = new API(this.props.keycloak);
      var self = this;
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
          var api = new API(self.props.keycloak);
          var query = {
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

  handleArrowClick() {
    console.log("LEFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT");
    console.log("on card");
    console.log(this.state.onCard);
    console.log(Date.now());
    console.log("Diff");
    console.log(Math.abs(this.state.swipeTimeDiff - Date.now()));
    if (
      this.state.onCard > 0 &&
      Math.abs(this.state.swipeTimeDiff - Date.now()) > 250
    ) {
      this.setState({ onCard: this.state.onCard - 1 });
      var fontSize = parseFloat(
        getComputedStyle(document.documentElement).fontSize
      );
      var menuWrapper = document.querySelectorAll(".menu-wrapper--inner")[
        this.props.count
      ];
      var threeDVal = Number(
        String(menuWrapper.style.transform)
          .split("(")
          .pop()
          .split("px,")[0]
      );
      console.log("Three d val!");
      console.log(threeDVal);
      var transformSize = fontSize * 30 + threeDVal;
      console.log("transform size");
      console.log(transformSize);
      var fullTransformSize = convertRemToPixels(4.5) + transformSize;
      console.log("FULL TRANSFORM");
      console.log(fullTransformSize);
      var translate3d = "translate3d(" + fullTransformSize + "px, 0px, 0px)";

      // TODO Add calculation to prevent scroll if card is past limit

      console.log("handlerightarrowclick: " + translate3d);
      this.setState({ swipeTimeDiff: Date.now() });
      menuWrapper.style.transform = translate3d;
    }
  }
  handleArrowClickRight() {
    console.log("RIGHTTTTTTTTTTTTTTTTTTTTTTTTTTTTT");
    console.log("on card");
    console.log(this.state.onCard);
    console.log(Date.now());
    console.log("Diff");
    console.log(Math.abs(this.state.swipeTimeDiff - Date.now()));
    if (
      this.state.onCard + 1 < this.state.list.length &&
      Math.abs(this.state.swipeTimeDiff - Date.now()) > 250
    ) {
      this.setState({ onCard: this.state.onCard + 1 });
      var fontSize = parseFloat(
        getComputedStyle(document.documentElement).fontSize
      );
      var menuWrapper = document.querySelectorAll(".menu-wrapper--inner")[
        this.props.count
      ];
      var threeDVal = Number(
        String(menuWrapper.style.transform)
          .split("(")
          .pop()
          .split("px,")[0]
      );
      console.log("Three d val!");
      console.log(threeDVal);
      var transformSize = fontSize * 30 - threeDVal;
      console.log("transform size");
      console.log(transformSize);
      var fullTransformSize = convertRemToPixels(4.5) + transformSize;
      console.log("FULL TRANSFORM");
      console.log(fullTransformSize);
      var translate3d = "translate3d(" + -fullTransformSize + "px, 0px, 0px)";

      // TODO Add calculation to prevent scroll if card is past limit

      console.log("handlerightarrowclick: " + translate3d);
      this.setState({ swipeTimeDiff: Date.now() });
      menuWrapper.style.transform = translate3d;
    }
  }

  swipeRight() {
    this.handleArrowClick();
    console.log("handle arrow click props");
    console.log(this.props);
    var menuWrapper = document.querySelectorAll(".menu-wrapper--inner")[
      this.props.count
    ];
    console.log("COMPARISON TRANSITIONS");
    console.log(menuWrapper.style.transform);
    console.log(this.state.transformInitial);
    if (menuWrapper.style.transform === this.state.transformInitial) {
      var translate3d =
        "translate3d(" + convertRemToPixels(4.5) + "px, 0px, 0px)";
      console.log("rem size");
      console.log(
        parseFloat(getComputedStyle(document.documentElement).fontSize)
      );
      //menuWrapper.style.transform = translate3d;
      console.log(menuWrapper.style.transform);
    }
  }

  swipeLeft() {
    var translate3d =
      "translate3d(" + convertRemToPixels(4.5) + "px, 0px, 0px)";
    var menuWrapper = document.querySelectorAll(".menu-wrapper--inner")[
      this.props.count
    ];
    if (menuWrapper.style.transform === translate3d) {
      //menuWrapper.style.transform = this.state.transformInitial;
      console.log("updated transform");
      console.log(menuWrapper.style.transform);
    }
    this.handleArrowClickRight();
  }

  componentDidUpdate() {
    console.log("STATE UPDATED");
    console.log(this.state);
    // TODO: Figure out how to fix this lifecycle method
    if (this.containerRef.current !== null && this.menu.current !== null) {
      this.hammer = Hammer(this.containerRef.current);
      this.hammer.get("swipe").set({ threshold: 100, velocity: 0.7 });
      this.hammer.on("swiperight", () => this.swipeRight());
      this.hammer.on("swipeleft", () => this.swipeLeft());

      //this.hammer.on("swiperight", () => this.menu.handleArrowClick());
      //this.hammer.on("swipeleft", () => this.menu.handleArrowClickRight());
    }

    //if(this.props.profile !== null && this.props.merchant.merchant.id === 0 && this.state.bubblemsg === null) {
    //this.setState({"bubblemsg":"Hey " + this.props.profile.givenName + ", Welcome to ShopLoyal! Swipe to learn more!", "bubbleid":0});
    //}
  }

  animationend() {
    console.log("Does this animate?");
    if (this.state.transformInitial === null) {
      var menuWrapper = document.querySelectorAll(".menu-wrapper--inner")[
        this.props.count
      ];
      console.log("INITIAL MENU WRAPPER");
      console.log(menuWrapper.style.transform);
      this.setState({ transformInitial: menuWrapper.style.transform });
    }
    this.setState({ animationEnded: true });
  }

  render() {
    if (this.state.isLoading) {
      return <div />;
    }

    const menu = this.state.list;
    var translate = 0;

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
