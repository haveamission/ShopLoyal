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
import saveColor from '../actions/general'
import SLBubble from './SLBubble'


const getColors = require('get-image-colors')



const API = 'http://localhost:3000/merchants';
const merchantAPI = 'http://localhost:3000/merchants?count=3';
const addressAPI = 'http://localhost:3000/address/';




class Card extends Component {

  static getDerivedStateFromProps(props, state) {
    console.log("drived props");
    console.log(props);
    // Normalizing the data, as react adds an object wrapper sometimes
    var merchant = {};

    if(typeof props.merchant.merchant !== 'undefined') {
      merchant = props.merchant.merchant;
    }
    else {
      merchant = props.merchant;
    }
    return {"merchant": merchant};
  }

  state = {
    data: {},
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
    return <p>{error.message}</p>;
  }

  if (isLoading) {
    return <p>Loading ...</p>;
  }

  componentDidMount() {
    console.log(this.props);

    // Not ideal - deal with how react does this later

    if (typeof this.merchant !== 'undefined') {
    getColors(this.merchant).then(colors => {
      var colorsHex = colors.map(color => color.hex());
      this.lightestColor(colorsHex);
    })
  }

fetch(addressAPI + this.state.merchant.address_id)
.then(response => {
  if (response.ok) {
    return response.json();
  } else {
    throw new Error('Something wenta wrong ...');
  }
})
.then(
  data => this.setState({ data, isLoading: false }
  ))

}
  render() {
    if (!this.state.data) {
      return <div />
  }
  console.log("further bad days");
  console.log(this.props);
  console.log(this.state);

    return (
      <Link to={{
        pathname: `/detail/${this.state.merchant.id}`
      }}>
    <div className="card titlecard" style={{backgroundImage: `url(${this.state.merchant.coverPhoto})`}}>
    <div className="layer" style={{backgroundColor : this.state.cardColor}}></div>
    {/* Split off into another component */}
    {/*<SLBubble />*/}
      <div className="card-left">
        <div className="card-logo">
          <img className="card-logo-img" src={this.state.merchant.logo} />
        </div>
      </div>
      <div className="card-right">
        <img className="card-favorite" src={Favorite} />
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
    </Link>
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
  return bindActionCreators({saveColor}, dispatch);
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
      return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',.8)';
  }
  throw new Error('Bad Hex');
}