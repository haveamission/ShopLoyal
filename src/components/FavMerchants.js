import React, { Component } from 'react';
import API from './API'
import axios from 'axios';
import { connect } from "react-redux";
import Loading from './Loading'
import { Link } from 'react-router-dom'
import UnFavorite from "../img/full_heart_white.png";
import Favorite from "../img/full_heart_purple.png";
import Map from "../img/map.png";
import { push } from 'connected-react-router'
import { withKeycloak } from 'react-keycloak';
import Back from './Back';

class FavMerchantsItem extends React.Component {

      state = {
        merchant: this.props.merchant,
    }

    routeChange =() => {
        let path = "detail/" + this.state.merchant.id;
        this.props.dispatch(push(path));
        }

        processFavorite(data) {
            console.log(data);
            var merchant = this.state.merchant;
            merchant.isFavorite = !this.state.merchant.isFavorite
this.setState({merchant: merchant})
        }

        handleFavorite = (e) =>  {
            e.stopPropagation();
            console.log("child");

            if(this.props.keycloak.authenticated) {

              var body = {"merchantId": this.state.merchant.id, "status": !this.state.merchant.isFavorite}
              var api = new API(this.props.keycloak);
              api.setRetry(10);
              api.post("favoriteMerchantAPI", {"body": body}).then(
                response => this.processFavorite(response.data)
                ).catch(function(error) {
                console.log(error);
                })
            }
          }

    render() {

        console.log(this.state);

        if (!this.state.merchant) {
            return <div />
        }

        return(
            <div onClick={this.routeChange} className="fav-merchant-item" >
            <img className="fav-logo" src={this.state.merchant.logo} />
              <div className="fav-item">{this.state.merchant.name}</div>
              
              {this.state.merchant.isFavorite ? (
                <img className="favorite" onClick={this.handleFavorite} src={Favorite} key={this.state.merchant.id} value={this.state.merchant.isFavorite}/>
              ) : (
                <img className="favorite" onClick={this.handleFavorite} src={UnFavorite} key={this.state.merchant.id} value={this.state.merchant.isFavorite}/>
              )}
              <div className="fav-address"><img src={Map} />{this.state.merchant.address1}</div>
              </div>
        )
    }
}


class FavMerchants extends React.Component {
    constructor() {
    super();
    this.state =  {
        favs: null,
    }
  }

    /*
    * Probably switch this to cards when doing refactor.
    */
    loadFavMerchants(data) {
console.log(data);
var arr = [];
data.map((item, index) => {
    arr.push(
        <FavMerchantsItem merchant={item}/>
      )
      
 });
 this.setState({favs: arr})
    }
componentDidMount() {

  // TODO REPLACE WITH REAL LOCATION

  var query = {
    "lat": "42.2",
    "lng": "-83",
    "limit": "30",
  }

  var api = new API(this.props.keycloak);
  api.get("favoriteMerchantAPI", {"query": query}).then(
    response => this.loadFavMerchants(response.data)
    ).catch(function(error) {
    console.log(error);
    })
}

render() {
    return(
      <div>
<div className="fav-merchant-list">Favorite Merchants</div>
<div className="fav-merchant-list-parent">
    {this.state.favs}
    </div>
    <Link to='/map'>
    <button className="fav-merchant-button">Find More Merchants</button>
    </Link>
    </div>
    )
}

}
  
  export default withKeycloak(FavMerchants);