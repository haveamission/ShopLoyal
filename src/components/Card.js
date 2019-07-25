import React, { Component } from 'react';
import { ColorExtractor } from 'react-color-extractor';
import FakeLogo from "../img/fake_test_logo.png";
import UnFavorite from "../img/full_heart_white.png";
import Favorite from "../img/full_heart_purple.png";
import GrayCard from '../img/gray.png';
import MessageTextWhite from "../img/message.png";
import MessageTextPurple from '../resources/img/comments@3x.png';
import CallWhite from "../img/call.png";
import CallPurple from '../resources/img/call-purple.png'
import MapWhite from "../img/map.png";
import MapPurple from '../resources/img/map-purple.png';
import {Link} from 'react-router-dom';
import Background from "../img/fake_background_card.png";
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux'
//import saveColor from '../actions/general'
import {colorSave} from '../actions/color';
import Loading from './Loading'
import API from './API'
import { push } from 'connected-react-router'
import { withKeycloak } from 'react-keycloak';
import Img from 'react-image'
import Skeleton from 'react-loading-skeleton';
import BackgroundImageOnLoad from 'background-image-on-load';
import {firstFavoriteSave} from '../actions/firstFavorite';
import { toast } from 'react-toastify';
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

createChatLink() {

var path = "/chat/" + this.state.merchant.id;
if(this.props.merchant.id === 0) {
path = "#";
}

  return path;
}

createCallLink() {
var path = "tel:+" + this.state.merchant.phoneNumber;
if(this.props.merchant.id === 0) {
path = "#";
}
return path;
}

  createMapLink() {
  var path = "/map";
  if(this.props.merchant.id === 0) {
path = "#";
  }
  return path;
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
    if(this.props.merchant.id === 0) {
      e.stopPropagation();
      console.log("prevent propagation");
      return;
    }
    if(e.target.nodeName == "LI" || e.target.nodeName == "a") {
    return;
    }
    let path = "/detail/" + this.state.merchant.id;
    this.props.dispatch(push(path));
    }

    configuration(data) {
      //console.log("pre set state card");
      //console.log(data);
      var merchant = this.state.merchant;
      merchant.isFavorite = !merchant.isFavorite;
      this.setState({merchant: merchant});
    }

    handleLinks(e) {
      //e.stopPropagation();
      //console.log("e stop propogation");
    }

    launchInsiderModal() {
      toast.info(<span>Success! You've favorited a merchant. Now <span class='find-more'><Link to="/">favorite more merchants</Link></span></span>, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 7000,
      });
    }

    firstTimeFavoriteCheck() {
      //console.log(this.props);
      if(this.props.router.location.pathname.includes("detail") /*&& this.props.firstFavorite === null*/) {
  //this.props.firstFavoriteSave(true);
  this.launchInsiderModal();
      }
    }
  
  handleFavorite(e) {
    if(this.props.merchant.id === 0) {
return;
    }
    e.stopPropagation();
    if(this.props.keycloak.authenticated) {
      if(this.state.merchant.isFavorite !== true) {
this.firstTimeFavoriteCheck();
      }
      var api = new API(this.props.keycloak);
      var body = {"merchantId": this.state.merchant.id, "status": !this.state.merchant.isFavorite};
      api.setRetry(10);
      api.post("favoriteMerchantAPI", {"body": body}).then(
        response => this.configuration(response.data)
        ).catch(function(error) {
        //console.log(error);
        })
    }

  }

  lightestColor(colors) {
    var highestColor;
    var hspHighest = 0;
    colors.forEach(function(color) {
        var lightness = lightOrDark(color);
        if (lightness > hspHighest && lightness < 200) {
            hspHighest = lightness;
            highestColor = color;
        }
    });
    var hsla = hexToRgbA(highestColor);
    this.setState({cardColor: hsla});
    var merchantId = this.props.merchant.id;
    this.props.colorSave({color: hsla, id: merchantId});
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

    //console.log("THIS MERCHANT!!");
    //console.log(this.props.merchant);

    this.lightestColorGen()
    //styleGuideColorGen()

}

styleGuideColorGen() {

}

lightestColorGen() {
  if (typeof this.props.merchant !== 'undefined') {
    getColors(this.props.merchant.logo).then(colors => {
      // Should probably rewrite to make better use of chroma.js functions
      var colorsHSLA = colors.map(color => color.hsl());
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
  var MessageText = MessageTextWhite;
  var Call = CallWhite;
  var Map = MapWhite



  if(this.props.router.location.pathname.includes("detail")) {
    MessageText = MessageTextPurple;
    Call = CallPurple;
    Map = MapPurple;
  }
  const { bgIsLoaded } = this.state;

    return (
    <div className="card titlecard" onClick={this.routeChange} data-image={this.state.merchant.coverPhoto} style={{backgroundImage: `url(${!bgIsLoaded ? <GrayCard />: this.state.merchant.coverPhoto})`} || <Skeleton />}>
    <div className="layer" style={{backgroundColor : this.state.cardColor}}>{/*this.state.cardColor*/}</div>
    <div className="graycard"></div>
    {/*<div className="layer"></div>*/}
      <div className="card-left">
        <div className="card-logo">
          <img className="card-logo-img" src={this.state.merchant.logo} />
        </div>
      </div>
      <div className="card-right">
      {this.state.merchant.isFavorite ? (
        <img className={`card-favorite purple-favorite`} onClick={this.handleFavorite} src={Favorite} />
      ) : (
        <img className={`card-favorite white-favorite`} onClick={this.handleFavorite} src={UnFavorite} />
      )}
        
        <div className="card-right-bottom">
          <h2 className="card-title">{this.state.merchant.name}</h2>
          <div className="card-address">{this.state.merchant.address1}</div>
          <hr />
          <div className="card-nav">
          <ul>
          <Link to={{
                  pathname: this.createChatLink(),
                  state: {merchant: this.state.merchant}
          }}><li>Message<img src={MessageText} /></li></Link>
          <a href={this.createCallLink()}><li>Call<img src={Call} /></li></a>
          <Link to={{
                  pathname: this.createMapLink(),
                  state: {merchant_lat: this.state.merchant.latitude,
                    merchant_lng: this.state.merchant.longitude
                  }
          }}><li>Map<img src={Map} /></li></Link>
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
    color: state.color,
    firstFavorite: state.firstFavorite,
    router: state.router,
  };
};

function mapDispatchToProps(dispatch) {
  //return bindActionCreators({saveColor}, dispatch);
  let actions = bindActionCreators({ colorSave, firstFavoriteSave }, dispatch);
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
         console.log("HSLA HERE");
         var hsla = RGBAToHSLA(rgba[0], rgba[1], rgba[2], rgba[3]);
         console.log(hsla);
      return hsla;
  }
  throw new Error('Bad Hex');
}

function RGBAToHSLA(r,g,b,a) {

  r = parseInt(r);
  g = parseInt(g);
  b = parseInt(b);

  console.log("red " + r);
  console.log("green " + g);
  console.log("blue " + b);

// TODO: Worry about color correction later



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


  var hsla = "hsla(" + h + "," + "50" + "%," + "50" + "%," + a + ")";
  return hsla;
}

function generateRandomInteger(min, max) {
  return Math.floor(min + Math.random()*(max + 1 - min))
}