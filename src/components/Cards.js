import React, { Component } from 'react';
import FakeLogo from "../img/fake_test_logo.png";
import Favorite from "../img/full_heart.png";
import Background from "../img/fake_background_card.png";
import Message from "../img/message.png";
import ShopLoyalIcon from "../img/ShopLoyalIcon.png";
import Call from "../img/call.png";
import Map from "../img/map.png";
import CardRow from "./CardRow";
import axios from 'axios';
import API from './API'
import { connect } from "react-redux";
import Loading from './Loading'
import axiosRetry from 'axios-retry';
import { withKeycloak } from 'react-keycloak';
import {addTokens} from '../actions/tokens';
import {bindActionCreators} from 'redux'


const introCard = {
  address1: "",
  address2: "",
  coverPhoto: "https://s3.us-east-2.amazonaws.com//wantify/merchants/36/cover-photo.jpg",
  distanceFrom: "0.1",
  id: 0,
  latitude: "42.547684",
  logo: "https://wantify-public.s3.us-east-2.amazonaws.com/ShopLoyalIcon.png",
  longitude: "-83.213518",
  name: "ShopLoyal",
  phoneNumber: "",
  }

class Cards extends Component {
    state = {
        data: [],
        isLoading: true,
        position: {
          latitude: 0,
          longitude: 0,
        },
search: "",
      }
      constructor() {
        super();
        //console.log(navigator);
        this.unmounted = false;
      }

      componentWillUnmount() {
        // indicate that the component has been unmounted
        this.unmounted = true;
      }

      componentDidUpdate(prevProps, prevState) {
      }
      

      configuration(data) {
        //console.log("merchant data");
        //console.log(data);
        console.log("CARD DATA");
        console.log(data);
        if (data === undefined || data.length == 0) {
          data.push(introCard);
      }
        this.setState({data, isLoading: false});
        //console.log("card row data");
        //console.log(data);
          }

          componentWillUnmount() {
            window.scrollTo(0, 0);
          }
    

    componentDidMount() {
      if(this.props.tokens !== null) {
        //this.props.addTokens(this.props.tokens);
      }

      //console.log("PROPS KEYCLOAK");
      //console.log(this.props.keycloak);
      if(this.props.keycloak.authenticated) {
        var api = new API(this.props.keycloak);
        api.setRetry(10);
        var query = {
          "lat": this.props.coordinates.coords.latitude,
          "lng": this.props.coordinates.coords.longitude,
          "radius": "10.0",
          "limit": "5",
          // TODO: Change this to be consistent with other search values
          "search": this.state.search,
        }
        api.get("favoriteMerchantAPI", {"query": query}).then(
          response => this.configuration(response.data)
          ).catch(function(error) {
          console.log(error);
          })
      }
   

      //console.log("geolocation");
      //console.log(navigator.geolocation);


      //console.log("position gets here")
      //console.log(this.state);


        }

        if (error) {
            return <p>{error.message}</p>;
          }
        render() {
          if (this.state.isLoading) {
            return <Loading />;
          }
          //console.log("state value new");
            return (
    <div className="cards">
    {this.state.data.map( (merchant, index) =>
     <CardRow
     merchant={{merchant}}
     count={index}
     className={'card-color-' + index}
     key={merchant.id}
      />
  )}
    </div>
);
        }
    }
    
  
    const mapStateToProps = (state) => {
      return {
        router: state.router,
        tokens: state.tokens,
        coordinates: state.coordinates,
      };
    };

    function mapDispatchToProps(dispatch) {
      let actions =  bindActionCreators({ addTokens }, dispatch);
      return { ...actions, dispatch };
    }
    
    export default connect(mapStateToProps, mapDispatchToProps)(withKeycloak(Cards));
