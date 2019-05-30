import React, { Component } from 'react';
import Card from "./Card";
import Page from './Page'
import { connect } from 'react-redux'
import getLocation from '../actions/location'
import {bindActionCreators} from 'redux'
import axios from 'axios';
import API from './API'
import Promotions from './Promotions'

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

    state = {
        data: {
        },
        search: "",
      }

      goBack() {
        this.props.history.goBack();
      }


      constructor() {
        super();
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(this.showPosition);
        }
        this.showPosition = this.showPosition.bind(this);
      }

      configuration(data) {
        console.log("merchant data");
        console.log(data);
        this.setState({data, isLoading: false});
        console.log("card row data");
        console.log(data);
          }

          showPosition =(position) =>  {
            console.log("position");
            console.log(position);
            this.setState({position: position.coords});
            if(this.props.oidc) {
              var merchant_id = this.props.location.pathname.substr(this.props.location.pathname.lastIndexOf('/') + 1);
              let config = {
                headers: {
                  Authorization: "Bearer " + this.props.oidc.user.access_token,
                  //Origin: "App",
                }
              }
              console.log("top girl");
              console.log(API.localBaseUrlString + API.merchantAPI + "/" + merchant_id + "?lat=" + this.state.position.latitude + "&lng=" + this.state.position.longitude + "&radius=10.0&limit=30&search=" + this.state.search);
              axios.get(API.localBaseUrlString + API.merchantAPI + "/" + merchant_id + "?lat=" + this.state.position.latitude + "&lng=" + this.state.position.longitude + "&radius=10.0&limit=30&search=" + this.state.search, config).then(
                response => this.configuration(response.data)
              ).catch(function(error) {
                console.log(error);
              })
            
            }
          }


      componentWillMount() {

        }

        if (error) {
            return <p>{error.message}</p>;
          }
        
          if (isLoading) {
            return <p>Loading ...</p>;
          }

    render() {
console.log(this.state.data);
        if (Object.keys(this.state.data).length == 0) {
            return <div />
        }
        console.log("not empty");
        console.log(this.state.data);
   
        return (
    <Page>
    <div className="detail">
    <i onClick={this.goBack} className="ico-times"></i>
    <Card merchant={this.state.data}/>
    <About desc={this.state.data.longDescription}/>
    <Promotions location={this.props.location}/>
    </div>
    </Page>
)
    }
}

const mapStateToProps = (state) => {
  return {
    oidc: state.oidc,
    coordinates: state.coordinates,
  };
};

function mapDispatchToProps(dispatch) {
  let actions = bindActionCreators({ getLocation });
  return { ...actions, dispatch };
}

export default  connect(mapStateToProps, mapDispatchToProps)(Detail);