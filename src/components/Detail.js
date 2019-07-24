import React, { Component } from 'react';
import Card from "./Card";
import { connect } from 'react-redux'
import getLocation from '../actions/location'
import {bindActionCreators} from 'redux'
import axios from 'axios';
import API from './API'
import Promotions from './Promotions'
import { withKeycloak } from 'react-keycloak';
import Loading from './Loading';

class About extends Component {
  render() {
    return (
<div className="about">
<h3>About</h3>
<p>{this.props.desc}</p>
</div>
);
  }
}

class Detail extends Component {
  constructor() {
    super();
    this.goBack = this.goBack.bind(this);
    this.state = {
      data: {
      },
      search: "",
    }
  }


      goBack() {
        this.props.history.goBack();
      }


 

      configuration(data) {
        //console.log("merchant data");
        //console.log(data);
        this.setState({data, isLoading: false});
        //console.log("card row data");
        //console.log(data);
          }

          componentDidMount() {
            if(this.props.keycloak.authenticated) {
              var merchant_id = this.props.location.pathname.substr(this.props.location.pathname.lastIndexOf('/') + 1);
              var query = {
                "lat": this.props.coordinates.coords.latitude,
                "lng": this.props.coordinates.coords.longitude,
                "radius": "10.0",
                "limit": "30",
                // TODO: Change this to be consistent with other search values
                "search": this.state.search,
              }

              var api = new API(this.props.keycloak);
              api.setRetry(3);
              api.get("merchantDetailAPI", {"repl_str": merchant_id, "query": query}).then(
                response => this.configuration(response.data)
                ).catch(function(error) {
                console.log(error);
                })
            
            }
          }


        if (error) {
            return <p>{error.message}</p>;
          }
        
          if (isLoading) {
            return <Loading />;
          }

    render() {
//console.log(this.state.data);
        if (Object.keys(this.state.data).length == 0) {
            return <div />
        }
        //console.log("not empty");
        //console.log(this.state.data);
   
        return (
  
    <div className="detail">
    {/*<i onClick={this.goBack} className="ico-times"></i>*/}
    <Card merchant={this.state.data}/>
    <About desc={this.state.data.longDescription}/>
    <Promotions location={this.props.location}/>
    </div>
)
    }
}

const mapStateToProps = (state) => {
  return {
    coordinates: state.coordinates,
  };
};

function mapDispatchToProps(dispatch) {
  let actions = bindActionCreators({ getLocation }, dispatch);
  return { ...actions, dispatch };
}

export default  connect(mapStateToProps, mapDispatchToProps)(withKeycloak(Detail));