import React, { Component } from 'react';
import API from './API'
import axios from 'axios';
import { connect } from "react-redux";
import Loading from './Loading'
import { Link } from 'react-router-dom'
import Page from './Page'
import UnFavorite from "../img/full_heart_white.png";
import Favorite from "../img/full_heart_purple.png";
import Map from "../img/map.png";
import { push } from 'connected-react-router'
import { withKeycloak } from 'react-keycloak';

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
              let config = {
                headers: {
                  Authorization: "Bearer " + this.props.keycloak.idToken,
                  //Origin: "App",
                }
              }
              //this.state.merchant.isFavorite
              console.log("Before favorite send");
              axios.post(API.prodBaseUrlString + API.favoriteMerchantAPI, {"merchantId": this.state.merchant.id, "status": !this.state.merchant.isFavorite}, config).then(
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
        <FavMerchantsItem merchant={item} oidc={this.props.keycloak.authenticated}/>
      )
      
 });
 this.setState({favs: arr})
    }
componentDidMount() {

    let config = {
        headers: {
          Authorization: "Bearer " + this.props.keycloak.idToken,
        }
      }
      
  axios.get(API.prodBaseUrlString + API.favoriteMerchantAPI + "?lat=42.2&limit=30&lng=-83", config).then(
  response => this.loadFavMerchants(response.data)
  ).catch(function(error) {
  console.log(error);
  })
}

render() {
    return(
        <Page>
<div className="fav-merchant-list">Favorite Merchants</div>
<div>
    {this.state.favs}
    </div>
    </Page>
    )
}



}
  
  export default withKeycloak(FavMerchants);