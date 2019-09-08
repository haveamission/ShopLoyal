import React, { Component } from "react";
import ShopLoyalCardLogo from "../../resources/img/ShopLoyalLogoIcon.png";
import ScrollMenu from "react-horizontal-scrolling-menu";
import Card from "./Card";
import PromoCard from "../notices/PromoCard";
import API from "../../utils/API";
import { connect } from "react-redux";
import { withKeycloak } from "react-keycloak";
import Hammer from "hammerjs";
import { smallRadius, largeLimit, defaultIndent, scaleFactor, minTimeDiff, threshold, velocity } from "../../config/constants"
import { arrayNormalize, convertRemToPixels, getFontSize, getThreeDVal } from "../../utils/misc"

/**
 * The card row - this structure contains the primary card, as well as the notice cards
 */
class CardRow extends Component {
  constructor() {
    super();
    this.state = {
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

  promoCardConfiguration(promoCardData) {
    promoCardData = arrayNormalize(promoCardData);
    promoCardData.forEach(promo => {
      this.state.list.push(
        <PromoCard
          data={promo}
          key={promo.id}
          merchant_id={this.props.merchant.merchant.id}
        />
      );
    });

    this.setState({ promoCardData, isLoading: false });
  };

  /**
   * Iterates over a list of messages from merchants and finds the first one (last sent) to a customer
   * @param {return from merchantMessages API} data 
   */
  merchantMessageConfiguration(messageData) {
    let msg;
    let text_msg;
    for (let el of messageData) {
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
          radius: smallRadius,
          limit: largeLimit,
          search: self.props.category.category,
          value: self.props.search.search
        };
        api
          .get("merchantNoticesAPI", {
            repl_str: self.props.merchant.merchant.id,
            query: query
          })
          .then(response => self.promoCardConfiguration(response.data))
          .catch(function (error) {
            console.log(error);
          });
      });
  }

  /**
   * Deprecated - used with the intro card that is now gone. They may want to re-enable a default message though, so in the interim
   * I am leaving this in
   */
  componentWillMount() {
    /*
    if (this.props.merchant.merchant.id === 0) {
      this.setState({
        bubblemsg:
          "Hey " +
          this.props.keycloak.idTokenParsed.given_name +
          ", Welcome to ShopLoyal! Swipe to learn more!",
        bubbleid: 0
      });
    }*/
  }

  // Minor duplication below. May be possible to reduce it further, but not by much
  // In addition, references to querySelectorAll not ideal - should change to ref at some point

  /**
   * Calculates where the card should swipe to the right, taking into account positioning based on messages from merchants
   */
  swipeRight() {
    if (
      this.state.onCard > 0 &&
      Math.abs(this.state.swipeTimeDiff - Date.now()) > minTimeDiff
    ) {
      this.setState({ onCard: this.state.onCard - 1 });
      let fontSize = getFontSize();
      let menuWrapper = document.querySelectorAll(".menu-wrapper--inner")[
        this.props.count
      ];
      let threeDVal = getThreeDVal(menuWrapper);
      let transformSize = fontSize * scaleFactor + threeDVal;
      let fullTransformSize = convertRemToPixels(defaultIndent) + transformSize;
      let translate3d = "translate3d(" + fullTransformSize + "px, 0px, 0px)";
      this.setState({ swipeTimeDiff: Date.now() });
      menuWrapper.style.transform = translate3d;
    }
  }
  /**
   * Calculates where the card should swipe to the left, taking into account positioning based on messages from merchants
   */
  swipeLeft() {
    if (
      this.state.onCard + 1 < this.state.list.length &&
      Math.abs(this.state.swipeTimeDiff - Date.now()) > minTimeDiff
    ) {
      this.setState({ onCard: this.state.onCard + 1 });
      let fontSize = getFontSize();
      let menuWrapper = document.querySelectorAll(".menu-wrapper--inner")[
        this.props.count
      ];
      let threeDVal = getThreeDVal(menuWrapper);
      let transformSize = fontSize * scaleFactor - threeDVal;
      let fullTransformSize = convertRemToPixels(defaultIndent) + transformSize;
      let translate3d = "translate3d(" + -fullTransformSize + "px, 0px, 0px)";

      this.setState({ swipeTimeDiff: Date.now() });
      menuWrapper.style.transform = translate3d;
    }
  }

  componentDidUpdate() {
    // This has to be set in componentDidUpdate due to the nature of how hammerjs works
    if (this.containerRef.current !== null && this.menu.current !== null) {
      this.hammer = Hammer(this.containerRef.current);
      this.hammer.get("swipe").set({ threshold: threshold, velocity: velocity });
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

    let translate = 0;

    if (this.state.bubblemsg && this.state.animationEnded) {
      translate = convertRemToPixels(defaultIndent);
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
