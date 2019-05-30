import React, { Component } from "react";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";
import Business from './Business';
import SwipeToDismiss from 'react-swipe-to-dismiss';
import Page from './Page'
import axios from 'axios';
import API from './API';
import { connect } from "react-redux";
import searchSave from '../actions/search'
import {bindActionCreators} from 'redux'
import getLocation from '../actions/location'
import Loading from './Loading'

const mapStyles = {
  width: "100%",
  height: "40%"
};

export class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      search: this.props.search.search,
    };
   
  }

  getDrivedStateFromProps(props, state) {
    this.setState({search: this.props.search.search})
  }

  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
      showResults: true
    });

  onMapClicked = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
    this.setState({ showResults: true })
  };

  componentWillMount() {
 
  }

  configuration(data) {
    console.log("map configuration");
    console.log(data);
  }

  componentDidMount() {
    console.log("Map props");
    console.log(this.props);
    //this.props.getLocation();
    

    if(this.props.oidc) {
      let config = {
        headers: {
          Authorization: "Bearer " + this.props.oidc.user.access_token,
          //Origin: "App",
        }
      }
        console.log("top girl");
        console.log(this.props);
        console.log(API.localBaseUrlString + API.merchantAPI + "?lat=" + this.props.coordinates.coords.latitude + "&lng=" + this.props.coordinates.coords.longitude + "&radius=10.0&limit=30&search=" + this.state.search + "&value=" + this.props.search.search);
        axios.get(API.localBaseUrlString + API.merchantAPI + "?lat=" + this.props.coordinates.coords.latitude + "&lng=" + this.props.coordinates.coords.longitude + "&radius=10.0&limit=30&search=" + this.state.search + "&value=" + this.props.search.search, config).then(
          response => this.configuration(response.data)
        ).catch(function(error) {
          console.log(error);
        })


    
    }
  }

  render() {
    console.log("props before loading");
    console.log(this.props);

    if (this.props.coordinates.length == 0) {
      return <Loading />
  }

    return (
      <Page>
        {this.props.search.search}
      <div className="gmaps">
      <Map
        google={this.props.google}
        zoom={15}
        style={mapStyles}
        onClick={this.mapClicked}
        initialCenter={{
          lat: this.props.coordinates.coords.latitude,
          lng: this.props.coordinates.coords.longitude
        }}
        zoomControl={false}
        mapTypeControl={false}
        streetViewControl={false}
        fullscreenControl={false}
      >
 <Marker
    title={'Adventures in Toys'}
    name={'Adventures in Toys'}
    position={{lat: 42.5467, lng: -83.2113}}
    onClick={this.onMarkerClick}
    />
     <Marker
    title={'Test Marker 2'}
    name={'Test Marker 2'}
    position={{lat: 43.5467, lng: -83.2113}}
    onClick={this.onMarkerClick}
    />
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}>
            <div>
              <h2>{this.state.selectedPlace.name}</h2>
            </div>
        </InfoWindow>
      </Map>
<div>
        <Business />
</div>
        <h3>
      { this.state.showResults ? <Results /> : null }
      </h3>
      </div>
      </Page>
    );
  }
}

export class Results extends Component {
  render() {
    return (
      <div id="results" className="search-results">
      Some Results
  </div>
    );
  }
}

const mapStateToProps = (state) => {
  console.log("map state to props");
  console.log(state);
  return {
    oidc: state.oidc,
    search: state.search,
    coordinates: state.coordinates,
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ searchSave, getLocation }, dispatch);
  //return { ...actions, dispatch };
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyC8ayoSBFNdHdORkbiteD5feHhpLYsToWE"
})(connect(mapStateToProps, mapDispatchToProps)(MapContainer));