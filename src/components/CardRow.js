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
import API from './API'
import { connect } from "react-redux";

/*const list = [
    <Card />,
    <PromoCard />,
    <PromoCard />,
    <PromoCard />,
    <PromoCard />,
]*/

const promoIter = ({ data, isLoading, error }) => {
//console.log("test");
return null;
}


function rnd(min,max){
    return Math.floor(Math.random()*(max-min+1)+min );
}
   
  class CardRow extends Component {
    constructor() {
      super();
      //console.log("constructor works");
      //console.log(withFetching);
      //console.log(noticeAPI);
      //console.log(promoIter);
    //const test = withFetching(noticeAPI)(promoIter);
    //console.log("BEFORE TEST");
    //console.log(test);
}



list = []

componentWillMount() {
  //console.log("will mount");
  //const test = withFetching(noticeAPI)(promoIter);
  //this.setState({testval: test})
  //console.log(this.props.merchant);
  console.log("props merchant");
  console.log(this.props.merchant);
  this.list.push(<Card merchant={this.props.merchant.merchant} />)
}

componentDidMount() {
  //console.log("did mount");
  //console.log(this.props.merchant);
  console.log("will mount merchant");
  console.log(this.props.merchant);

}
    render() {
   
      return (
        <div className="App">
           
          <ScrollMenu
            data={this.list}
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