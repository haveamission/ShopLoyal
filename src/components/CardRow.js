import React, { Component } from 'react';
import FakeLogo from "../img/fake_test_logo.png";
import Favorite from "../img/full_heart.png";
import Background from "../img/fake_background_card.png";
import Message from "../img/message.png";
import Call from "../img/call.png";
import Map from "../img/map.png";
import ScrollMenu from 'react-horizontal-scrolling-menu';
import Card from "./Card";
import PromoCard from "./PromoCard";
//import withFetching from "./API";
import axios from 'axios';
import API from './API';
import { connect } from "react-redux";
import NotifBubble from './NotifBubble'
import { withKeycloak } from 'react-keycloak';
import Loading from './Loading';
import axiosRetry from 'axios-retry';
import Hammer from 'hammerjs';
const format = require('string-format')


/*const list = [
    <Card />,
    <PromoCard />,
    <PromoCard />,
    <PromoCard />,
    <PromoCard />,
]*/

function loadJSONIntoUI(data) {

  if(!(data instanceof Array)){
     data = [data];
  }

  return data;
}

function rnd(min,max){
    return Math.floor(Math.random()*(max-min+1)+min );
}
   
  class CardRow extends Component {

constructor() {
  super();
  this.state = {
    data: [],
    search: "",
    list: [
    ],
    isLoading: true,
  }
  this.menu = null;
}

containerRef = React.createRef();
scrollRef = React.createRef();

configuration =(data) =>  {
  data = loadJSONIntoUI(data);
  data.forEach((promo) => {
    this.state.list.push(<PromoCard data={promo} key={promo.id}/>);
      });

  this.setState({data, isLoading: false});
}

merchantMessageConfiguration(data) {
var msg;
for (let el of data) {
  console.log(el);
  if (el.recipient === "customer") {
    msg = el;
    break;
  }
}
console.log("MESSAGE VALUE HERE");
console.log(msg);
this.setState({"bubblemsg":msg.message, "bubbleid":msg.merchantId});
}

componentDidMount() {
  if(this.props.keycloak.authenticated) {
    var api = new API(this.props.keycloak);
    var query = {
      "lat": this.props.coordinates.coords.latitude,
      "lng": this.props.coordinates.coords.longitude,
      "radius": "10.0",
      "limit": "30",
      "search": this.props.category.category,
      "value": this.props.search.search
    }
    api.get("merchantNoticesAPI", {"repl_str": this.props.merchant.merchant.id, "query": query}).then(
      response => this.configuration(response.data)
      ).catch(function(error) {
      console.log(error);
      })
  }

  console.log("props merchant");
  console.log(this.props.merchant);
  this.state.list.push(<Card merchant={this.props.merchant.merchant} key={this.props.merchant.merchant.id} />)

  if(this.props.keycloak.authenticated /*&& this.props.count == 0*/) {
var merchant_id = this.props.merchant.merchant.id;
var api = new API(this.props.keycloak);
api.setRetry(10);
api.get("merchantMessages", {"repl_str": merchant_id}).then(
  response => this.merchantMessageConfiguration(response.data)
  ).catch(function(error) {
  console.log(error);
  })
  }


  window.addEventListener('scroll', function() {
  });



}

componentDidUpdate() {
  // TODO: Figure out how to fix this lifecycle method
  console.log(this.containerRef);
  if(this.containerRef.current !== null && this.menu.current !== null) {
console.log("this gon' be my year");
    console.log(this.containerRef.current);
    this.hammer = Hammer(this.containerRef.current)
    console.log(this.scrollRef.handleArrowClick);
    this.hammer.on("swiperight", () => this.menu.handleArrowClick());
    this.hammer.on("swipeleft", () => this.menu.handleArrowClickRight());

    //this.hammer.on("swiperight", () => this.menu.handleArrowClick());
    //this.hammer.on("swipeleft", () => this.menu.handleArrowClickRight());


    }
}

    render() {

      if (this.state.isLoading) {
        return <div/>
    }

    const menu = this.state.list;

    //console.log("CARD ITEM FOR LIST");
    //console.log(JSON.stringify(this.state.list));
var translate = 0;
    if(this.state.bubblemsg) {
      translate = 50;
    }
   
      return (
        <div className={"App slide-in-card card-row card-color " + this.props.className} ref={this.containerRef}>
              {this.state.bubblemsg ? (
        <NotifBubble message={this.state.bubblemsg} merchant={this.props.merchant.merchant}/>
      ) : (
       null
      )}
          <ScrollMenu
            data={this.state.list}
            inertiaScrolling={true}
            dragging={false}
            transition={.2}
            scrollBy={1}
            inertiaScrollingSlowdown={.9}
            ref={el => (this.menu = el)}
            translate={translate}
            alignCenter={true}
          />
        </div>
      );
    }
  }

  const mapStateToProps = (state) => {
    return {
      search: state.search,
      coordinates: state.coordinates,
      category: state.categories,
    };
  };
  

  export default connect(mapStateToProps)(withKeycloak(CardRow));