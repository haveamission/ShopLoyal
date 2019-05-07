import React, { Component } from 'react';
import { ColorExtractor } from 'react-color-extractor';
import FakeLogo from "../img/fake_test_logo.png";
import Favorite from "../img/full_heart_white.png";
import MessageText from "../img/message.png";
import Call from "../img/call.png";
import Map from "../img/map.png";
import withFetching from "./API";
import {Link} from 'react-router-dom';
import Background from "../img/fake_background_card.png";
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux'
import * as generalActions from '../actions/general'


const API = 'http://localhost:3000/merchants';
const merchantAPI = 'http://localhost:3000/merchants?count=3';
const addressAPI = 'http://localhost:3000/address/';


const Bubble = () => (
<Link to="/chat/"><div className="bubble">Sample text Merchant Text</div></Link>
);

class Card extends Component {

  state = {
    data: []
  }

  

  //console.log("Works?");
  //console.log(data);
  //console.log(isLoading);
  //console.log(error);

  if (error) {
    return <p>{error.message}</p>;
  }

  if (isLoading) {
    return <p>Loading ...</p>;
  }

  componentWillMount() {
    console.log(this.props);
    
console.log(this.props.merchant.merchant);

console.log(addressAPI + this.props.merchant.merchant.address_id);

fetch(addressAPI + this.props.merchant.merchant.address_id)
.then(response => {
  if (response.ok) {
    return response.json();
  } else {
    throw new Error('Something went wrong ...');
  }
})
.then(
  data => this.setState({ data, isLoading: false }
  ))


  }

  componentDidMount() {
    this.props.general.levelUp();
  }

  render() {
   
    return (
    <div className="card titlecard" style={{backgroundImage: `url(${this.props.merchant.merchant.coverPhoto})`}}>

    <div className="layer"></div>
    {/* Split off into another component */}
    <Bubble />
      <div className="card-left">
        <div className="card-logo">
          <img className="card-logo-img" src={this.props.merchant.merchant.logo} />
        </div>
      </div>
      <div className="card-right">
        <img className="card-favorite" src={Favorite} />
        <div className="card-right-bottom">
          <h2 className="card-title">{this.props.merchant.merchant.name}</h2>
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
    general: state.general
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({General: generalActions}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Card)

//export default Card;

class Swatch extends Component {
  componentWillMount() {
  console.log("test value here");
  }

  render() {
   
    return (

  <ColorExtractor
    src={this.props.merchant.merchant.coverPhoto}
    getColors={colors => lightestColor(colors)}
  />

);
}
}

export { Swatch };

  function lightestColor(colors) {
    console.log("lightest colors");
    var hspHighest = 0;
colors.forEach(function(color){
  //console.log(color);
  var lightness = lightOrDark(color);
  if (lightness > hspHighest) {
    hspHighest = lightness;
    lightestColor = color;
  }

});
console.log(hspHighest);
console.log(lightestColor);
console.log(hexToRgbA(lightestColor));
  }

  function hexToRgbA(hex){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',1)';
    }
    throw new Error('Bad Hex');
}

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
    } 
    else {
        
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