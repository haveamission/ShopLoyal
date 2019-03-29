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

/*const list = [
    <Card />,
    <PromoCard />,
    <PromoCard />,
    <PromoCard />,
    <PromoCard />,
]*/

const list = [
    <Card />,
]

function rnd(min,max){
    return Math.floor(Math.random()*(max-min+1)+min );
}
var i = 0;
for (i = 0; i < rnd(2, 4); i++) { 
list.push(<PromoCard />);
}
   
  class CardRow extends Component {
   
    render() {
   
      return (
        <div className="App">
          <ScrollMenu
            data={list}
          />
        </div>
      );
    }
  }

  export default CardRow;