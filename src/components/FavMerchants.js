import React, { Component } from "react";
import API from "./API";
import { connect } from "react-redux";
import Loading from "./Loading";
import { Link } from "react-router-dom";
import UnFavorite from "../resources/img/full_heart_white.png";
import Favorite from "../resources/img/full_heart_purple.png";
import Map from "../resources/img/map.png";
import { push } from "connected-react-router";
import { withKeycloak } from "react-keycloak";

class FavMerchantsItem extends Component {
  state = {
    merchant: this.props.merchant
  };

  routeChange = () => {
    let path = "/detail/" + this.state.merchant.id;
    this.props.dispatch(push(path));
  };

  processFavorite(data) {
    let merchant = this.state.merchant;
    merchant.isFavorite = !this.state.merchant.isFavorite;
    this.setState({ merchant: merchant });
  }

  handleFavorite = e => {
    e.stopPropagation();

    if (this.props.keycloak.authenticated) {
      let body = {
        merchantId: this.state.merchant.id,
        status: !this.state.merchant.isFavorite
      };
      let api = new API(this.props.keycloak);
      api.setRetry(3);
      api
        .post("favoriteMerchantAPI", { body: body })
        .then(response => this.processFavorite(response.data))
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  render() {
    if (!this.state.merchant) {
      return <Loading />;
    }

    return (
      <div onClick={this.routeChange} className="fav-merchant-item">
        <img className="fav-logo" src={this.state.merchant.logo} />
        <div className="fav-item">{this.state.merchant.name}</div>

        {this.state.merchant.isFavorite ? (
          <img
            className="purple-favorite favorite"
            onClick={this.handleFavorite}
            src={Favorite}
            key={this.state.merchant.id}
            value={this.state.merchant.isFavorite}
          />
        ) : (
            <img
              className="white-favorite favorite"
              onClick={this.handleFavorite}
              src={UnFavorite}
              key={this.state.merchant.id}
              value={this.state.merchant.isFavorite}
            />
          )}
        <div className="fav-address">
          <img src={Map} />
          {this.state.merchant.address1}
        </div>
      </div>
    );
  }
}

const FavMerchantsItemRedux = connect()(withKeycloak(FavMerchantsItem));

class FavMerchants extends React.Component {
  constructor() {
    super();
    this.state = {
      favs: null
    };
  }

  /*
   * Probably switch this to cards when doing refactor.
   */
  loadFavMerchants(data) {
    let arr = [];
    data.map((item, index) => {
      arr.push(<FavMerchantsItemRedux merchant={item} key={index} />);
    });
    this.setState({ favs: arr });
  }
  componentDidMount() {
    // TODO REPLACE WITH REAL LOCATION

    let query = {
      lat: this.props.coordinates.coords.latitude,
      lng: this.props.coordinates.coords.longitude,
      limit: "30"
    };

    let api = new API(this.props.keycloak);
    api
      .get("favoriteMerchantAPI", { query: query })
      .then(response => this.loadFavMerchants(response.data))
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    return (
      <div>
        <div className="fav-merchant-list">Favorite Merchants</div>
        <div className="fav-merchant-list-parent">{this.state.favs}</div>
        <Link to="/map">
          <button className="fav-merchant-button">
            Favorite More Merchants Now
          </button>
        </Link>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    coordinates: state.coordinates
  };
};

export default connect(mapStateToProps)(withKeycloak(FavMerchants));
