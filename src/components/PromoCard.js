import React, { Component } from 'react';
import FakeLogo from "../img/fake_test_logo.png";
import Favorite from "../img/full_heart.png";
import Background from "../img/fake_background_card.png";
import Message from "../img/message.png";
import Call from "../img/call.png";
import Map from "../img/map.png";

class PromoCard extends Component {

    componentDidMount() {
        console.log("promo card props");
        console.log(this.props);
    }
    render() {
        return(
    <div className={"card promocard promocard-" + this.props.count}>
    <div className="promo-name"><img src={this.props.data.photo} />{this.props.data.merchant.name}</div>
    <img className="promo-main-img" src={this.props.data.photo} />
    <div className="promo-title">{this.props.data.title}</div>
    <div className="promo-desc">{this.props.data.text}</div>
    <div className="promo-bottom"></div>
    </div>
);
    }
}

export default PromoCard;