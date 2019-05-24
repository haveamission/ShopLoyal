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

  export default {
    localBaseUrlString:"https://cors-anywhere.herokuapp.com/https://dev.apiv2.wantify.com/api/v1",
    devBaseUrlString:"https://dev.apiv2.wantify.com/api/v1",
    prodBaseUrlString:"https://api.v2.wantify.com/api/v1",
 
    userNoticesAPI:"/users/me/notices",
    userPushRegisterAPI:"/users/me/register_device",
    userInvitesAPI:"users/me/invites",
  
    merchantTypeaheadSearchAPI:"/search",
    merchantsAPI:"/merchants",
    favoriteMerchantAPI:"users/me/favorites",
    /* the two below are variables, change */
    merchantAPI:"/merchants",
    merchantNoticesAPI:"/merchants/%@/notices",
    userProfileAPI:"/users/me/profile",
    userFavoritesAPI:"/users/me/favorites"
  }