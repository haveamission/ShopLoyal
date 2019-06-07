import React, { Component } from 'react';

/*const withFetching = (url) => (Comp) =>
  class WithFetching extends Component {
    constructor(props) {
      super(props);

      this.state = {
        data: [],
        isLoading: false,
        error: null
      };
    }

    componentDidMount() {
      this.setState({ isLoading: true });

      fetch(url)
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Something went wrong ...');
          }
        })
        .then(data => this.setState({ data, isLoading: false }))
        .catch(error => this.setState({ error, isLoading: false }));
    }

    render() {
        //return "test";
      return <Comp { ...this.props } { ...this.state } />
    }
  }

  export default withFetching;*/

  var corsString = "https://cors-anywhere.herokuapp.com/";

  export default {
    corsString: corsString,
    /*prodBaseUrlString:corsString + "https://dev.apiv2.wantify.com/api/v1",*/
    localBaseUrl:corsString + "https://api.v2.wantify.com/api/v1",
    devBaseUrlString:"https://dev.apiv2.wantify.com/api/v1",
    prodBaseUrlString:"https://api.v2.wantify.com/api/v1",
 
    userNoticesAPI:"/users/me/notices",
    userPushRegisterAPI:"/users/me/register_device",
    userInvitesAPI:"/users/me/invites",
    userLogout:"/users/me/logout",
  
    merchantTypeaheadSearchAPI:"/search",
    merchantAPI:"/merchants",
    favoriteMerchantAPI:"/users/me/favorites",
    /* the two below are variables, change */
    merchantNoticesAPI:"/merchants/{}/notices",
    userProfileAPI:"/users/me/profile",
    userFavoritesAPI:"/users/me/favorites",
    // Add a way to get one-way messages later on
    merchantMessages:"/merchants/{}/message/history?limit=20&skip=0",
    merchantSendMessage:"/merchants/{}/message",
    
    channels: "/users/me/channels",
    channel: "/users/me/channel",

    settings: "/users/settings",



  }