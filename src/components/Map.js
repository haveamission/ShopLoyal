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
import { push } from 'connected-react-router'

const mapStyles = {
  width: "100%",
  height: "72vh"
};

function search(nameKey, myArray){
  console.log("my array");
  console.log(myArray);
  for (var i=0; i < myArray.length; i++) {
    console.log("my array id");
    console.log(myArray[i].id);
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
      data: {merchants: []},
      selectedMerchant: null,
      rerendered: 0,
    };
   
  }

  componentWillUnmount(){
    /*document.body.style.position = "static";
    document.getElementById("root").style.overflow = 'visible';
    document.getElementById("root").style.height = 'height';*/
}

  componentWillMount() {
    
    //document.getElementById("root").style.height = '100vh';
    //document.body.style.position = "fixed";
    var centerLat = this.props.coordinates.coords.latitude;
    var centerLng = this.props.coordinates.coords.longitude;
  
    console.log(this.state);
    console.log(this.props.location);
  
    // This should be a good enough check for now about whether latitude and longitude are defined
    // Possibly make this more robust later
    if(typeof this.props.location.state !== 'undefined') {
      centerLat = this.props.location.state.merchant_lat;
      centerLng = this.props.location.state.merchant_lng;
    }
    this.setState({centerLat: centerLat, centerLng: centerLng});
  }

  onMarkerClick = (props, marker, e) => {
    console.log("marker title");
    console.log(marker.title);
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
    if(typeof window.Keyboard.hide !== 'undefined') {
    window.Keyboard.hide();
    }
  };

  mapIconLoad() {
    var radius = 10.0;
    if(this.props.search.search !== null) {
      radius = 30.0;
    }
    if(this.props.keycloak.authenticated) {
      var api = new API(this.props.keycloak);
      api.setRetry(3);
      var query = {
        "lat": this.state.centerLat,
        "lng": this.state.centerLng,
        "radius": radius,
        "limit": "10",
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
    if(this.state.rerendered < 2) {
this.setState({rerendered: this.state.rerendered + 1})
    }
    if(this.state.updatedSearch == this.props.search.search && this.state.updatedCategories == this.props.category.category) {
      return;
    }
this.mapIconLoad();


  }

  configuration(data) {
    console.log("map configuration");
    console.log(data);
    this.setState({data: data, updatedSearch: this.props.search.search, updatedCategories: this.props.category.category, selectedMerchant: data.merchants[0]});
  }

  componentDidMount() {
    window.scrollTo(0, 0);
this.mapIconLoad();
if(typeof window.Keyboard.show !== 'undefined') {
  window.Keyboard.show();
  }
 
  }

  render() {

    if (this.state.rerendered < 2) {
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
        initialCenter={{
          lat: this.state.centerLat,
          lng: this.state.centerLng,
        }}
        zoomControl={false}
        mapTypeControl={false}
        streetViewControl={false}
        fullscreenControl={false}
        gestureHandling="greedy"
        onClick={() => this.onMapClicked()}
      >
        {this.state.data.merchants.map( merchant =>
     <Marker
     title={String(merchant.id)}
     name={merchant.name}
     position={{lat: merchant.latitude, lng: merchant.longitude}}
     onClick={() => {this.props.dispatch(push("/detail/" + merchant.id))}}
     icon={{url: merchant.logo,
      scaledSize: new this.props.google.maps.Size(64,64)
    }}
    key={merchant.id}
    style={{zIndex: 100}}
      />
  )}

      </Map>
<div className="business-cards">

        {
          this.state.rerendered > 1 && this.state.data.merchants.length !== 0 ? (
          this.state.data.merchants.slice(0, 2).map( merchant =>

          <Business merchant={merchant} />
  )):(
    ""
  )

}


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
  let actions = bindActionCreators({ searchSave, getLocation }, dispatch);
  return { ...actions, dispatch };
}

const LoadingContainer = (props) => (
  <div></div>
)

export default GoogleApiWrapper({
  apiKey: "AIzaSyC8ayoSBFNdHdORkbiteD5feHhpLYsToWE",
  LoadingContainer: LoadingContainer
})(connect(mapStateToProps, mapDispatchToProps)(withKeycloak(MapContainer)));