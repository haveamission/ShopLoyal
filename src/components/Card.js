import React, { Component } from 'react';
import { ColorExtractor } from 'react-color-extractor';
import FakeLogo from "../img/fake_test_logo.png";
import UnFavorite from "../img/full_heart_white.png";
import Favorite from "../img/full_heart_purple.png";
import MessageText from "../img/message.png";
import Call from "../img/call.png";
import Map from "../img/map.png";
import withFetching from "./API";
import {Link} from 'react-router-dom';
import Background from "../img/fake_background_card.png";
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux'
import saveColor from '../actions/general'
import SLBubble from './SLBubble'
import Loading from './Loading'
import axios from 'axios'
import API from './API'
import { push } from 'connected-react-router'


const getColors = require('get-image-colors')

class Card extends Component {

  routeChange =() => {
    console.log(this.state);
    let path = "detail/" + this.state.merchant.id;
    this.props.dispatch(push(path));
    }
  
  handleFavorite(e) {
    e.stopPropagation();
    console.log("child");
    if(this.props.oidc) {
      let config = {
        headers: {
          Authorization: "Bearer " + this.props.oidc.user.access_token,
          //Origin: "App",
        }
      }
      //this.state.merchant.isFavorite
      console.log("Before favorite send");
      axios.post(API.localBaseUrlString + API.favoriteMerchantAPI, {"merchantId": this.state.merchant.id, "status": !this.state.merchant.isFavorite}, config).then(
        response => this.configuration(response.data)
      ).catch(function(error) {
        console.log(error);
      })
    
    }
  }

  constructor() {
    super();
    this.state = {
      data: {},
    }
    this.routeChange = this.routeChange.bind(this);
    this.handleFavorite = this.handleFavorite.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    // Normalizing the data, as react adds an object wrapper sometimes

    var merchant = {}

    if(typeof props.merchant.merchant !== 'undefined') {
      merchant = props.merchant.merchant;
    }
    else {
      merchant = props.merchant;
    }
    return {"merchant": merchant};
  }



  lightestColor(colors) {
    var highestColor;
    var hspHighest = 0;
    colors.forEach(function(color) {
        var lightness = lightOrDark(color);
        if (lightness > hspHighest) {
            hspHighest = lightness;
            highestColor = color;
        }
    });
    this.setState({cardColor: hexToRgbA(highestColor)});
  }

  if (error) {
    console.log(error);
    return <p>{error.message}</p>;
  }

  if (isLoading) {
    return <Loading />;
  }

  componentDidMount() {
    console.log(this.props);

    // Not ideal - deal with how react does this later

    console.log("THIS MERCHANT!!");
    console.log(this.props.merchant);

    if (typeof this.props.merchant !== 'undefined') {
    getColors(API.corsString + this.props.merchant.coverPhoto).then(colors => {
      var colorsHex = colors.map(color => color.hex());
      this.lightestColor(colorsHex);
    })
  }
}



  render() {
    if (!this.state.data) {
      return <div />
  }
  console.log("further bad days");
  console.log(this.props);
  console.log(this.state);

    return (
    <div className="card titlecard" onClick={this.routeChange}style={{backgroundImage: `url(${this.state.merchant.coverPhoto})`}}>
    <div className="layer" style={{backgroundColor : this.state.cardColor}}></div>
    {/* Split off into another component */}
    {/*<SLBubble />*/}
      <div className="card-left">
        <div className="card-logo">
          <img className="card-logo-img" src={this.state.merchant.logo} />
        </div>
      </div>
      <div className="card-right">
      {this.state.merchant.isFavorite ? (
        <img className={`card-favorite`} onClick={this.handleFavorite} src={Favorite} />
      ) : (
        <img className={`card-favorite`} onClick={this.handleFavorite} src={UnFavorite} />
      )}
        
        <div className="card-right-bottom">
          <h2 className="card-title">{this.state.merchant.name}</h2>
          <div className="card-address">{this.state.data.address1}</div>
          <hr />
          <div className="card-nav">
          <ul>
          <li>Message<img src={MessageText} /></li>
          <li>Call<img src={Call} /></li>
          <li>Map<img src={Map} /></li>
          </ul>
              </div>
        </div>
      </div>
    </div>
);
}
}

const mapStateToProps = (state) => {
  return {
    //general: state.general,
    oidc: state.oidc,
    color: state.saveColor
  };
};

function mapDispatchToProps(dispatch) {
  //return bindActionCreators({saveColor}, dispatch);
  let actions = bindActionCreators({ saveColor });
  return { ...actions, dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(Card)

//export default Card;

function lightOrDark(color) {
  // Variables for red, green, blue values
  var r, g, b, hsp;

  // Check the format of the color, HEX or RGB?
  if (color.match(/^rgb/)) {

      // If HEX --> store the red, green, blue values in separate variables
      color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);

      r = color[1];
      g = color[2];
      b = color[3];
  } else {

      // If RGB --> Convert it to HEX: http://gist.github.com/983661
      color = +("0x" + color.slice(1).replace(
          color.length < 5 && /./g, '$&$&'));

      r = color >> 16;
      g = color >> 8 & 255;
      b = color & 255;
  }

  // HSP (Highly Sensitive P) equation from http://alienryderflex.com/hsp.html
  hsp = Math.sqrt(
      0.299 * (r * r) +
      0.587 * (g * g) +
      0.114 * (b * b)
  );

  // Return HSP value
  return hsp;
}

function hexToRgbA(hex) {
  var c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('');
      if (c.length == 3) {
          c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = '0x' + c.join('');
      return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',.7)';
  }
  throw new Error('Bad Hex');
}