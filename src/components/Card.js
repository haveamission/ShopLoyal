import React, { Component } from 'react';
import { ColorExtractor } from 'react-color-extractor';
import FakeLogo from "../img/fake_test_logo.png";
import UnFavorite from "../img/full_heart_white.png";
import Favorite from "../img/full_heart_purple.png";
import MessageText from "../img/message.png";
import GrayCard from '../img/gray.png';
import Call from "../img/call.png";
import Map from "../img/map.png";
import {Link} from 'react-router-dom';
import Background from "../img/fake_background_card.png";
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux'
import saveColor from '../actions/general'
import Loading from './Loading'
import axios from 'axios'
import API from './API'
import { push } from 'connected-react-router'
import { withKeycloak } from 'react-keycloak';
import axiosRetry from 'axios-retry';
import Img from 'react-image'
import Skeleton from 'react-loading-skeleton';
import BackgroundImageOnLoad from 'background-image-on-load';
const format = require('string-format')
const getColors = require('get-image-colors')

class Card extends Component {
  constructor() {
    super();
    this.state = {
      data: {},
      bgIsLoaded: false
    }
    this.routeChange = this.routeChange.bind(this);
    this.handleFavorite = this.handleFavorite.bind(this);
    this.handleLinks = this.handleLinks.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    // Normalizing the data, as react adds an object wrapper sometimes

    var merchant = {}

    //console.log("CARDS PROPS");
    //console.log(props);

    if(typeof props.merchant.merchant !== 'undefined') {
      merchant = props.merchant.merchant;
    }
    else {
      merchant = props.merchant;
    }
    return {"merchant": merchant};
  }

  routeChange =(e) => {
    if(e.target.nodeName == "LI" || e.target.nodeName == "a") {
    return;
    }
    let path = "/detail/" + this.state.merchant.id;
    this.props.dispatch(push(path));
    }

    configuration(data) {
      //alert("Completed one round");
      console.log("pre set state card");
      console.log(data);
      var merchant = this.state.merchant;
      merchant.isFavorite = !merchant.isFavorite;
      this.setState({merchant: merchant});
    }

    handleLinks(e) {
      //e.stopPropagation();
      console.log("e stop propogation");
    }
  
  handleFavorite(e) {
    e.stopPropagation();
    if(this.props.keycloak.authenticated) {
      var api = new API(this.props.keycloak);
      var body = {"merchantId": this.state.merchant.id, "status": !this.state.merchant.isFavorite};
      api.setRetry(10);
      api.post("favoriteMerchantAPI", {"body": body}).then(
        response => this.configuration(response.data)
        ).catch(function(error) {
        console.log(error);
        })
    }

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

    // Not ideal - deal with how react does this later

    console.log("THIS MERCHANT!!");
    console.log(this.props.merchant);

    this.lightestColorGen()
    //styleGuideColorGen()

}

styleGuideColorGen() {

}

lightestColorGen() {
  if (typeof this.props.merchant !== 'undefined') {
    getColors(this.props.merchant.coverPhoto).then(colors => {
      var colorsHex = colors.map(color => color.hex());
      this.lightestColor(colorsHex);
    })
  }
}

componentWillUnmount() {
  // indicate that the component has been unmounted
}

  render() {

    if (!this.state.data) {
      return <div />
  }
  const { bgIsLoaded } = this.state;
  //console.log("further bad days");
  //console.log(this.props);
  //console.log(this.state);

    return (
    <div className="card titlecard" onClick={this.routeChange} data-image={this.state.merchant.coverPhoto} style={{backgroundImage: `url(${!bgIsLoaded ? <GrayCard />: this.state.merchant.coverPhoto})`} || <Skeleton />}>
    <div className="layer" style={{backgroundColor : this.state.cardColor}}></div>
    <div className="graycard"></div>
    {/*<div className="layer"></div>*/}
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
          <div className="card-address">{this.state.merchant.address1}</div>
          <hr />
          <div className="card-nav">
          <ul>
          <Link to={{
                  pathname: "/chat/" + this.state.merchant.id,
                  state: {merchant: this.state.merchant}
          }}><li>Message<img src={MessageText} /></li></Link>
          <a href={"tel:+" + this.state.merchant.phoneNumber}><li>Call<img src={Call} /></li></a>
          <Link to="/map"><li>Map<img src={Map} /></li></Link>
          </ul>
              </div>
        </div>
        </div>
      <BackgroundImageOnLoad	
            src={this.state.merchant.coverPhoto}	
            onLoadBg={() =>	
              this.setState({	
              bgIsLoaded: true	
            })}	
            onError={err => console.log('error', err)}	
          />	
    </div>
);
}
}

const mapStateToProps = (state) => {
  return {
    //general: state.general,
    color: state.saveColor
  };
};

function mapDispatchToProps(dispatch) {
  //return bindActionCreators({saveColor}, dispatch);
  let actions = bindActionCreators({ saveColor }, dispatch);
  return { ...actions, dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(withKeycloak(Card));

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
      var rgba = 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',.8)';
      rgba = rgba.substring(5, rgba.length-1)
         .replace(/ /g, '')
         .split(',');
      return RGBAToHSLA(rgba[0], rgba[1], rgba[2], rgba[3]);
  }
  throw new Error('Bad Hex');
}

function RGBAToHSLA(r,g,b,a) {

  r = parseInt(r);
  g = parseInt(g);
  b = parseInt(b);

// TODO: Worry about color correction later


  //alert(r + g + b);


/*if(r + g + b > 650) {
var colorArr = ['r', 'g', 'b'];
var rand = colorArr[Math.floor(Math.random() * colorArr.length)];
window.rand = window.rand - 100;
}*/



  r /= 255;
  g /= 255;
  b /= 255;

  // Find greatest and smallest channel values
  let cmin = Math.min(r,g,b),
      cmax = Math.max(r,g,b),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = 0;

    // Calculate hue
  // No difference
  if (delta == 0)
    h = 0;
  // Red is max
  else if (cmax == r)
    h = ((g - b) / delta) % 6;
  // Green is max
  else if (cmax == g)
    h = (b - r) / delta + 2;
  // Blue is max
  else
    h = (r - g) / delta + 4;

  h = Math.round(h * 60);
    
  // Make negative hues positive behind 360°
  if (h < 0)
      h += 360;

  // Calculate lightness
  l = (cmax + cmin) / 2;

  // Calculate saturation
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    
  // Multiply l and s by 100
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  var hsla = "hsla(" + h + "," + 100 + "%," +l + "%," + a + ")";
  return hsla;
}