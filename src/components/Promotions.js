import React, { Component } from 'react';
import axios from 'axios';
import API from './API'
import { connect } from 'react-redux'
import PromoCard from './PromoCard'
const format = require('string-format')

function loadJSONIntoUI(data) {

    if(!(data instanceof Array)){
       data = [data];
    }

    return data;
}

class Promotions extends Component {

    constructor() {
        super();
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(this.showPosition);
        }
        this.showPosition = this.showPosition.bind(this);
      }

    state = {
        data: {
        },
        search: "",
      }

    configuration(data) {
        console.log("notices");
        console.log(data);
        data = loadJSONIntoUI(data);

        this.setState({data, isLoading: false});

/*var promotions = [];
        data.forEach(function(obj) {
            console.log(obj);
            promotions.push(<PromoCard data={obj} />);
            });
            this.setState({promotions, isLoading: false})*/
    }

    showPosition =(position) =>  {
        console.log("position");
        console.log(position);
        this.setState({position: position.coords});
        console.log(this.props);
        if(this.props.oidc) {
          var merchant_id = this.props.location.pathname.substr(this.props.location.pathname.lastIndexOf('/') + 1);
          let config = {
            headers: {
              Authorization: "Bearer " + this.props.oidc.user.access_token,
              //Origin: "App",
            }
          }
          console.log("top girl");
          console.log(API.localBaseUrlString + format(API.merchantNoticesAPI, merchant_id) + "?lat=" + this.state.position.latitude + "&lng=" + this.state.position.longitude + "&radius=10.0&limit=30&search=" + this.state.search);
          axios.get(API.localBaseUrlString + format(API.merchantNoticesAPI, merchant_id) + "?lat=" + this.state.position.latitude + "&lng=" + this.state.position.longitude + "&radius=10.0&limit=30&search=" + this.state.search, config).then(
            response => this.configuration(response.data)
          ).catch(function(error) {
            console.log(error);
          })
        
        }
      }

componentDidMount() {
    /*
    if(this.props.oidc) {
        var merchant_id = this.props.location.pathname.substr(this.props.location.pathname.lastIndexOf('/') + 1);
        let config = {
          headers: {
            Authorization: "Bearer " + this.props.oidc.user.access_token,
            //Origin: "App",
          }
        }
        console.log("top girl");
        console.log(API.localBaseUrlString + format(API.merchantNoticesAPI, merchant_id) + "?lat=" + this.state.position.latitude + "&lng=" + this.state.position.longitude + "&radius=10.0&limit=30&search=" + this.state.search);
        axios.get(API.localBaseUrlString + format(API.merchantNoticesAPI, merchant_id) + "?lat=" + this.state.position.latitude + "&lng=" + this.state.position.longitude + "&radius=10.0&limit=30&search=" + this.state.search, config).then(
          response => this.configuration(response.data)
        ).catch(function(error) {
          console.log(error);
        })
      
      }*/
}

    render() {

        if (Object.keys(this.state.data).length == 0) {
            return <div />
        }

        console.log("state data before promo");
        console.log(this.state);

      return (
  <div className="promotions">
  <h3>Updates</h3>
  {this.state.data.map( promo =>
    <PromoCard data={promo} />
  )}
  </div>
  );
    }
  }

  const mapStateToProps = (state) => {
    return {
      oidc: state.oidc,
    };
  };

  export default  connect(mapStateToProps, null)(Promotions);