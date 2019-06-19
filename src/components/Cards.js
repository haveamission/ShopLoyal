import React, { Component } from 'react';
import FakeLogo from "../img/fake_test_logo.png";
import Favorite from "../img/full_heart.png";
import Background from "../img/fake_background_card.png";
import Message from "../img/message.png";
import Call from "../img/call.png";
import Map from "../img/map.png";
import CardRow from "./CardRow";
import Page from './Page'
import axios from 'axios';
import API from './API'
import { connect } from "react-redux";
import Loading from './Loading'
import axiosRetry from 'axios-retry';
import { withKeycloak } from 'react-keycloak';

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
        //alert(JSON.stringify(navigator));
        this.showPosition = this.showPosition.bind(this);
        this.unmounted = false;
      }

      componentWillUnmount() {
        // indicate that the component has been unmounted
        this.unmounted = true;
      }

      componentDidUpdate(prevProps, prevState) {
//alert(JSON.stringify(prevProps));
//alert(JSON.stringify(prevState));
      }
      

      configuration(data) {
        console.log("merchant data");
        console.log(data);
        this.setState({data, isLoading: false});
        console.log("card row data");
        console.log(data);
          }

          showPosition = (position) =>  {
            if (this.unmounted) { return; }
            console.log("position");
            console.log(position);
            this.setState({position: position.coords});
            console.log("PROPS KEYCLOAK");
            console.log(this.props.keycloak);
            if(this.props.keycloak.authenticated) {
              console.log("id token");
              console.log(this.props.keycloak.idToken);
              console.log("token");
              console.log(this.props.keycloak.token)
              axiosRetry(axios, { retries: 10 });
              let config = {
                headers: {
                  Authorization: "Bearer " + this.props.keycloak.idToken,
                  //Origin: "App",
                }
              }
              console.log(API.prodBaseUrlString + API.merchantAPI + "?lat=" + this.state.position.latitude + "&lng=" + this.state.position.longitude + "&radius=10.0&limit=5&search=" + this.state.search);
              axios.get(API.prodBaseUrlString + API.merchantAPI + "?lat=" + this.state.position.latitude + "&lng=" + this.state.position.longitude + "&radius=10.0&limit=5&search=" + this.state.search, config).then(
                response => this.configuration(response.data)
              ).catch(function(error) {
                console.log("500 error here???");
                console.log(error);
                //alert(error);
              })
            
            }
          }
    

    componentDidMount() {

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.showPosition);
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
          console.log("state value new");
          //alert("Each time this loads");
          //alert(JSON.stringify(this.state.data));
          console.log(this.state.data);
          //alert("PROPS!");
          //alert(JSON.stringify(this.props));
            return (
    <div className="cards">
    {this.state.data.merchants.map( (merchant, index) =>
     <CardRow
     merchant={{merchant}}
     count={index}
     className={'card-color-' + index}
      />
  )}
    </div>
);
        }
    }
    
  
    const mapStateToProps = (state) => {
      return {
        router: state.router,
      };
    };
    
    export default connect(mapStateToProps)(withKeycloak(Cards));
