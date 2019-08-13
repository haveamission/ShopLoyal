import React, { Component } from "react";
import FakeLogo from "../img/fake_test_logo.png";
import Favorite from "../img/full_heart.png";
import Background from "../img/fake_background_card.png";
import Message from "../img/message.png";
import Call from "../img/call.png";
import Map from "../img/map.png";
import ShopLoyalCardLogo from "../img/ShopLoyalLogoIcon.png";
import ScrollMenu from "react-horizontal-scrolling-menu";
import Card from "./Card";
import PromoCard from "./PromoCard";
//import withFetching from "./API";
import axios from "axios";
import API from "./API";
import { connect } from "react-redux";
import NotifBubble from "./NotifBubble";
import { withKeycloak } from "react-keycloak";
import Loading from "./Loading";
import axiosRetry from "axios-retry";
import Hammer from "hammerjs";
const format = require("string-format");

/*const list = [
    <Card />,
    <PromoCard />,
    <PromoCard />,
    <PromoCard />,
    <PromoCard />,
]*/

function loadJSONIntoUI(data) {
  if (!(data instanceof Array)) {
    data = [data];
  }

  return data;
}

function rnd(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

class CardRow extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      search: "",
      list: [],
      isLoading: true,
      bubblemsg: null
    };
    this.menu = null;
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
      console.log("loop element");
      console.log(el);
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
    console.log("MESSAGE VALUE HERE");
    console.log(msg);
    this.setState({ bubblemsg: text_msg, bubbleid: msg.merchantId });
  }

  componentDidMount() {
    //console.log("props merchant");
    //console.log(this.props.merchant);

    if (this.props.keycloak.authenticated) {
      //
      console.log("THIS PROPS before merchant");
      console.log(this.props.merchant.merchant);
      if (this.props.merchant.merchant.id === 0) {
        console.log("create intro");
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
        .catch(function(error) {
          console.log(error);
        })
        .finally(function() {
          console.log("MAKES IT TO FINALLY");
          self.state.list.push(
            <Card
              merchant={self.props.merchant.merchant}
              key={self.props.merchant.merchant.id}
              bubblemsg={self.state.bubblemsg}
            />
          );
        })
        .finally(function() {
          console.log("Makes it to second finally");
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
            .catch(function(error) {
              console.log(error);
            });
        });
    }

    window.addEventListener("scroll", function() {});
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

  componentDidUpdate() {
    console.log("STATE UPDATED");
    console.log(this.state);
    // TODO: Figure out how to fix this lifecycle method
    //console.log(this.containerRef);
    if (this.containerRef.current !== null && this.menu.current !== null) {
      //console.log(this.containerRef.current);
      this.hammer = Hammer(this.containerRef.current);
      //console.log(this.scrollRef.handleArrowClick);
      this.hammer.on("swiperight", () => this.menu.handleArrowClick());
      this.hammer.on("swipeleft", () => this.menu.handleArrowClickRight());

      //this.hammer.on("swiperight", () => this.menu.handleArrowClick());
      //this.hammer.on("swipeleft", () => this.menu.handleArrowClickRight());
    }

    //if(this.props.profile !== null && this.props.merchant.merchant.id === 0 && this.state.bubblemsg === null) {
    //this.setState({"bubblemsg":"Hey " + this.props.profile.givenName + ", Welcome to ShopLoyal! Swipe to learn more!", "bubbleid":0});
    //}
  }

  render() {
    if (this.state.isLoading) {
      return <div />;
    }

    const menu = this.state.list;

    //console.log("CARD ITEM FOR LIST");
    //console.log(JSON.stringify(this.state.list));
    var translate = 0;

    if (this.state.bubblemsg) {
      translate = convertRemToPixels(5);
    }

    return (
      <div
        className={
          "App slide-in-card card-row card-color " + this.props.className
        }
        ref={this.containerRef}
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
