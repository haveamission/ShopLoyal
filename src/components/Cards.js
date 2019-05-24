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

const merchantAPI = 'http://localhost:3000/merchants?count=3';

// Insert API call here?

class Cards extends Component {
    state = {
        data: [],
        isLoading: true
      }

      configuration(data) {
        console.log("merchant data");
        console.log(data);
        this.setState({data, isLoading: false});
        console.log("card row data");
        console.log(data);
          }
    

    componentDidMount() {

      if(this.props.oidc) {
        let config = {
          headers: {
            Authorization: "Bearer " + this.props.oidc.user.access_token,
            //Origin: "App",
          }
        }
        axios.get(API.localBaseUrlString + API.merchantAPI + "?lat=42.3968906547252&limit=30&lng=-82.9234670923287&radius=10.0&search=Food", config).then(
          response => this.configuration(response.data)
        ).catch(function(error) {
          console.log(error);
        })
      
      }
        }

        if (error) {
            return <p>{error.message}</p>;
          }
        



        render() {
          if (this.state.isLoading) {
            return <p>Loading ...</p>;
          }
          console.log("state value new");
          console.log(this.state.data.merchants);
            return (
    <Page>
    <div>
    {this.state.data.merchants.map( merchant =>
     <CardRow
     merchant={{merchant}}
      />
  )}
    </div>
    </Page>
);
        }
    }

    const mapStateToProps = (state) => {
      return {
        oidc: state.oidc
      };
    };
    
  
    export default connect(mapStateToProps)(Cards);
