import React, { Component } from "react";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";
import Business from './Business';
import SwipeToDismiss from 'react-swipe-to-dismiss';
import Page from './Page'

const mapStyles = {
  width: "100%",
  height: "40%"
};

export class MapContainer extends Component {
/* Replace state with Redux here */


  state = {
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
  };

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

  render() {
    return (
      <Page>
      <div className="gmaps">
      <Map
        google={this.props.google}
        zoom={15}
        style={mapStyles}
        onClick={this.mapClicked}
        initialCenter={{
          lat: 42.5467,
          lng: -83.2113
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

export default GoogleApiWrapper({
  apiKey: "AIzaSyC8ayoSBFNdHdORkbiteD5feHhpLYsToWE"
})(MapContainer);