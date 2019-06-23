import React, { Component } from "react";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";
import Business from './Business';
import SwipeToDismiss from 'react-swipe-to-dismiss';
import axios from 'axios';
import API from './API';
import { connect } from "react-redux";
import searchSave from '../actions/search'
import {bindActionCreators} from 'redux'
import getLocation from '../actions/location'
import Loading from './Loading'
import Categories from './Categories'
import { withKeycloak } from 'react-keycloak';

const mapStyles = {
  width: "100%",
  height: "100%"
};

function search(nameKey, myArray){
  console.log("my array");
  console.log(myArray);
  for (var i=0; i < myArray.length; i++) {
      if (myArray[i].id === nameKey) {
          return myArray[i];
      }
  }
}

export class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      search: "",
      data: {merchants: []},
      selectedMerchant: null,
    };
   
  }

  getDrivedStateFromProps(props, state) {
    this.setState({search: this.props.search.search});
    this.setState({category: this.props.category.category});
  }

  onMarkerClick = (props, marker, e) => {
  console.log(marker);
  console.log(e);
  console.log(marker.title);
  console.log("marker title");
  console.log(this.state.data);
  var selectedMerchant = search(parseInt(marker.title), this.state.data.merchants);
  this.setState({selectedMerchant: selectedMerchant});
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
      showResults: true,
    });
  }

  onMapClicked = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
    this.setState({ showResults: true })
  };

  mapIconLoad() {
    if(this.props.keycloak.authenticated) {
      var api = new API(this.props.keycloak);
      api.setRetry(10);
      var query = {
        "lat": this.props.coordinates.coords.latitude,
        "lng": this.props.coordinates.coords.longitude,
        "radius": "10.0",
        "limit": "30",
        "search": this.props.category.category,
        "value": this.props.search.search
      }
      api.get("merchantAPI", {"query": query}).then(
        response => this.configuration(response.data)
        ).catch(function(error) {
        console.log(error);
        })
    }
  }

  componentDidUpdate() {
    console.log("component did update");
    if(this.state.updatedSearch == this.props.search.search && this.state.updatedCategories == this.props.category.category) {
      return;
    }
this.mapIconLoad();


  }

  configuration(data) {
    console.log("map configuration");
    console.log(data);
    this.setState({data: data, updatedSearch: this.props.search.search, updatedCategories: this.props.category.category});
  }

  componentDidMount() {
this.mapIconLoad();
 
  }

  render() {

    if (this.props.coordinates.length == 0) {
      return <Loading />
  }

    return (
      <div>
            <Categories />
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
        {this.state.data.merchants.map( merchant =>
     <Marker
     title={String(merchant.id)}
     name={merchant.name}
     position={{lat: merchant.latitude, lng: merchant.longitude}}
     onClick={this.onMarkerClick}
     icon={{url: merchant.logo,
      scaledSize: new this.props.google.maps.Size(64,64)
    }}
      />
  )}

      </Map>
<div>

        {this.state.selectedMerchant ? (
        <Business merchant={this.state.selectedMerchant} />
      ) : (
        ""
      )}
</div>
        <h3>
      { this.state.showResults ? <Results /> : null }
      </h3>
      </div>
      </div>
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
    search: state.search,
    coordinates: state.coordinates,
    category: state.categories,
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ searchSave, getLocation }, dispatch);
  //return { ...actions, dispatch };
}

const LoadingContainer = (props) => (
  <div></div>
)

export default GoogleApiWrapper({
  apiKey: "AIzaSyC8ayoSBFNdHdORkbiteD5feHhpLYsToWE",
  LoadingContainer: LoadingContainer
})(connect(mapStateToProps, mapDispatchToProps)(withKeycloak(MapContainer)));