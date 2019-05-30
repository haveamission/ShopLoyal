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
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(this.showPosition);
  }
  this.showPosition = this.showPosition.bind(this);
}

state = {
  data: [],
  search: "",
  list: [],
}

configuration =(data) =>  {
  console.log("notices");
  console.log(data);
  data = loadJSONIntoUI(data);

  console.log("data before foreach");
  console.log(data);

  data.forEach((promo) => {
    this.state.list.push(<PromoCard data={promo}/>);
      });

  this.setState({data, isLoading: false});

/*var promotions = [];
  data.forEach(function(obj) {
      console.log(obj);
      promotions.push(<PromoCard data={obj} />);
      });
      this.setState({promotions, isLoading: false})*/
}

showPosition =(position) =>  {
  console.log("position");
  console.log(position);
  this.setState({position: position.coords});
  console.log(this.props);
  if(this.props.oidc) {
    let config = {
      headers: {
        Authorization: "Bearer " + this.props.oidc.user.access_token,
        //Origin: "App",
      }
    }
    console.log("top girl");
    console.log(API.localBaseUrlString + format(API.merchantNoticesAPI, this.props.merchant.merchant.id) + "?lat=" + this.state.position.latitude + "&lng=" + this.state.position.longitude + "&radius=10.0&limit=30&search=" + this.state.search);
    axios.get(API.localBaseUrlString + format(API.merchantNoticesAPI, this.props.merchant.merchant.id) + "?lat=" + this.state.position.latitude + "&lng=" + this.state.position.longitude + "&radius=10.0&limit=30&search=" + this.state.search, config).then(
      response => this.configuration(response.data)
    ).catch(function(error) {
      console.log(error);
    })
  
  }
}

componentWillMount() {
  //console.log("will mount");
  //const test = withFetching(noticeAPI)(promoIter);
  //this.setState({testval: test})
  //console.log(this.props.merchant);
  console.log("props merchant");
  console.log(this.props.merchant);
  this.state.list.push(<Card merchant={this.props.merchant.merchant} />)
  
}

componentDidMount() {
  //console.log("did mount");
  //console.log(this.props.merchant);
  console.log("did mount state promo");
  console.log(this.state);
  /*this.state.data.forEach(function(promo) {
  this.list.push(<PromoCard data={promo}/>);
    });*/

}
    render() {

      if (Object.keys(this.state).length == 0) {
        return <div />
    }
   
      return (
        <div className="App card-row">
           
          <ScrollMenu
            data={this.state.list}
          />
        </div>
      );
    }
  }

  const mapStateToProps = (state) => {
    return {
      oidc: state.oidc
    };
  };
  

  export default connect(mapStateToProps)(CardRow);