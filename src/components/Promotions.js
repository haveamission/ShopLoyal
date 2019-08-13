import React, { Component } from 'react';
import axios from 'axios';
import API from './API'
import { connect } from 'react-redux'
import PromoCard from './PromoCard'
import { withKeycloak } from 'react-keycloak';
const format = require('string-format')

function loadJSONIntoUI(data) {

  if (!(data instanceof Array)) {
    data = [data];
  }

  return data;
}

class Promotions extends Component {

  constructor() {
    super();
  }

  state = {
    data: {
    },
    search: "",
  }

  configuration(data) {
    //console.log("notices");
    //console.log(data);
    data = loadJSONIntoUI(data);

    this.setState({ data, isLoading: false });
  }

  componentDidMount() {
    if (this.props.keycloak.authenticated) {
      var api = new API(this.props.keycloak);
      var merchant_id = this.props.location.pathname.substr(this.props.location.pathname.lastIndexOf('/') + 1);
      //console.log("PROMO PROPS");
      //console.log(this.props);
      var query = {
        "lat": this.props.coordinates.coords.latitude,
        "lng": this.props.coordinates.coords.longitude,
        "radius": "10.0",
        "limit": "5",
        //"search": this.props.category.category,
        "search": this.props.search
      }
      api.get("merchantNoticesAPI", { "repl_str": merchant_id, "query": query }).then(
        response => this.configuration(response.data)
      ).catch(function (error) {
        console.log(error);
      })
    }
  }

  render() {

    if (Object.keys(this.state.data).length == 0) {
      return <div />
    }

    //console.log("state data before promo");
    //console.log(this.state);

    return (
      <div className="promotions">
        <h3>Updates</h3>
        {this.state.data.map((promo, index) =>
          <PromoCard data={promo} count={index} merchant_id={this.props.location.pathname.substr(this.props.location.pathname.lastIndexOf('/') + 1)} />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    coordinates: state.coordinates,
  };
};

export default connect(mapStateToProps, null)(withKeycloak(Promotions));