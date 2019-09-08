import React, { Component } from "react";
import Card from "./Card";
import { connect } from "react-redux";
import getLocation from "../../redux/actions/location";
import { bindActionCreators } from "redux";
import API from "../../utils/API";
import Promotions from "../notices/Promotions";
import { withKeycloak } from "react-keycloak";
import Loading from "../main/Loading";
import searchSave from "../../redux/actions/search";
import { AboutText } from "../../config/strings";
import { smallRadius, largeLimit } from "../../config/constants"
import { getMerchantIDFromPath } from "../../utils/misc"

/**
 * This is the "about" part of the detail page
 */
class About extends Component {
  render() {
    return (
      <div className="about">
        <h3>{AboutText}</h3>
        <p>{this.props.desc}</p>
      </div>
    );
  }
}

/**
 * This is the main component for the detail page
 */
class Detail extends Component {
  constructor() {
    super();
    this.state = {
      merchantDetailData: {},
      search: ""
    };
  }

  merchantDetailConfiguration(merchantDetailData) {
    this.setState({ merchantDetailData: merchantDetailData, isLoading: false });
  }

  componentWillMount() {
    this.props.searchSave("");
  }

  componentDidMount() {
    if (this.props.keycloak.authenticated) {
      let merchant_id = getMerchantIDFromPath(this.props.location);
      let query = {
        lat: this.props.coordinates.coords.latitude,
        lng: this.props.coordinates.coords.longitude,
        radius: smallRadius,
        limit: largeLimit,
        search: this.state.search
      };

      let api = new API(this.props.keycloak);
      api.setRetry(3);
      api
        .get("merchantDetailAPI", { repl_str: merchant_id, query: query })
        .then(response => this.merchantDetailConfiguration(response.data))
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  if(isLoading) {
    return <Loading />;
  }

  render() {
    if (Object.keys(this.state.merchantDetailData).length === 0) {
      return <div />;
    }

    return (
      <div className="detail">
        <Card merchant={this.state.merchantDetailData} />
        <About desc={this.state.merchantDetailData.longDescription} />
        <Promotions location={this.props.location} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    coordinates: state.coordinates
  };
};

function mapDispatchToProps(dispatch) {
  let actions = bindActionCreators({ getLocation, searchSave }, dispatch);
  return { ...actions, dispatch };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withKeycloak(Detail));
