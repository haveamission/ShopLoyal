import React, { Component } from "react";
import API from "../../utils/API";
import { connect } from "react-redux";
import PromoCard from "./PromoCard";
import { withKeycloak } from "react-keycloak";
import { arrayNormalize, getMerchantIDFromPath } from "../../utils/misc"
import { smallRadius, smallLimit } from "../../config/constants"

/**
 * This is a container for several PromoCards - this is located on the detail page
 */
class Promotions extends Component {

  state = {
    promoCardData: [],
    search: ""
  };

  loadPromoCards(promoCardData) {
    promoCardData = arrayNormalize(promoCardData);

    this.setState({ promoCardData, isLoading: false });
  }

  componentWillMount() {
    this.setState({ merchantId: getMerchantIDFromPath(this.props.location) });
  }

  componentDidMount() {
    let api = new API(this.props.keycloak);
    let query = {
      lat: this.props.coordinates.coords.latitude,
      lng: this.props.coordinates.coords.longitude,
      radius: smallRadius,
      limit: smallLimit,
      search: this.props.search
    };
    api
      .get("merchantNoticesAPI", { repl_str: this.state.merchantId, query: query })
      .then(response => this.loadPromoCards(response.data))
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    if (Object.keys(this.state.promoCardData).length === 0) {
      return <div />;
    }

    return (
      <div className="promotions">
        <h3>Updates</h3>
        {this.state.promoCardData.map((promo, index) => (
          <PromoCard
            promo={promo}
            count={index}
            key={this.state.promoCardData.id + "-" + index}
            merchantId={this.state.merchantId}
          />
        ))}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    coordinates: state.coordinates
  };
};

export default connect(
  mapStateToProps,
  null
)(withKeycloak(Promotions));
