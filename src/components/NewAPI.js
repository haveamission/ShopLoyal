import axios from 'axios'
import API from './API'
import {bindActionCreators} from 'redux'
import { withKeycloak } from 'react-keycloak';
const format = require('string-format')

class NewAPI {
    constructor(keycloak) {
        this.keycloak = keycloak;
        this.config = {
        headers: {
            Authorization: "Bearer " + this.keycloak.idToken,
          }
        }
     }

     call = null;
     env = "prod";

     corsString = "https://cors-anywhere.herokuapp.com/";
     localBaseUrlString = this.corsString + "https://api.v2.wantify.com/api/v1";
     devBaseUrlString = "https://dev.apiv2.wantify.com/api/v1";
     prodBaseUrlString = "https://api.v2.wantify.com/api/v1"; 
  
     userNoticesAPI = "/users/me/notices";
     userPushRegisterAPI = "/users/me/register_device";
     userInvitesAPI = "/users/me/invites";
     userLogout = "/users/me/logout";
   
     merchantTypeaheadSearchAPI = "/search";
     merchantAPI = "/merchants";
     favoriteMerchantAPI = "/users/me/favorites";
     /* the two below are variables, change */
     merchantNoticesAPI = "/merchants/{}/notices"; 
     userProfileAPI = "/users/me/profile";
     userFavoritesAPI = "/users/me/favorites";
     // Add a way to get one-way messages later on
     merchantMessages = "/merchants/{}/message/history?limit=20&skip=0";
     merchantSendMessage = "/merchants/{}/message";
     
     channels = "/users/me/channels";
     channel = "/users/me/channel";

     openChannel = "/channels/{}/open";
 
     settings = "/users/settings";

     returnVals(data) {

         alert(JSON.stringify(data));
         console.log("Data should be null here");
         console.log(data);
         return data;
     }
     

     get(API, argument = null) {
        var constructedURL = this.constructURL(API, argument);
        alert("config");
        alert(JSON.stringify(this.config));
        axios.get(constructedURL, this.config).then(
            response => alert(JSON.stringify(response.data))
            ).catch(function(error) {
            console.log(error);
            })
     }

     post(API, body, argument = null) {
        var constructedURL = this.constructURL(API, argument);
            return axios.post(constructedURL, body, this.config);
            
            /*.then(
            response => this.returnVals(response.data)
            ).catch(function(error) {
            console.log(error);
            })*/
     }

     constructURL(API, argument) {
         var constructedURL;
         var endpoint;
         if(typeof argument !== "undefined") {
         endpoint = format(this[API], argument)
         }
         else {
endpoint = this[API];
         }
if(this.env === 'local') {
    // Add some code to invalidate this if the call is POST
    constructedURL = this.corsString + this.localBaseUrl + endpoint;
}
else if(this.env === 'dev') {
    constructedURL = this.devBaseUrlString + endpoint;
}
else if(this.env === 'prod') {
    constructedURL = this.prodBaseUrlString + endpoint;
}
return constructedURL;
     }

  }

  export default NewAPI;