import axios from 'axios'
import API from './API'
import {bindActionCreators} from 'redux'
import { withKeycloak } from 'react-keycloak';
import axiosRetry from 'axios-retry';
import BackgroundImageOnLoad from 'background-image-on-load';
const format = require('string-format')

class SLAPI {
    constructor(keycloak) {
        this.keycloak = keycloak;
        this.config = {
        headers: {
            Authorization: "Bearer " + this.keycloak.idToken,
          }
        }
        if(this.env === "local") {
            //this.config.headers["origin"] = "local";
        }
     }

     defaultParams = {
         repl_str: null,
         body: {},
         query: {},
     }

     call = null;
     env = "local";
     retry = 1;

     setRetry(value) {
         this.retry = value;
     }

     corsString = "https://cors-anywhere.herokuapp.com/";
     localBaseUrlString = "https://api.v2.wantify.com/api/v1";
     devBaseUrlString = "https://dev.apiv2.wantify.com/api/v1";
     prodBaseUrlString = "https://api.v2.wantify.com/api/v1"; 
  
     userNoticesAPI = "/users/me/notices";
     userPushRegisterAPI = "/users/me/register_device";
     userInvitesAPI = "/users/me/invites";
     userLogout = "/users/me/logout";
   
     merchantTypeaheadSearchAPI = "/search";
     merchantAPI = "/merchants";
     merchantDetailAPI = "/merchants/{}";
     favoriteMerchantAPI = "/users/me/favorites";
     /* TODO: the two below are variables, change */
     merchantNoticesAPI = "/merchants/{}/notices"; 
     userProfileAPI = "/users/me/profile";
     userFavoritesAPI = "/users/me/favorites";
     // TODO: Add a way to get one-way messages later on
     merchantMessages = "/merchants/{}/message/history?limit=20&skip=0";
     merchantSendMessage = "/merchants/{}/message";
     
     channels = "/users/me/channels";
     channel = "/users/me/channel";

     openChannel = "/channels/{}/open";
 
     settings = "/users/settings";

     returnVals(data) {
         return data;
     }
     

     get(API, params = this.defaultParams) {
         this.call = "GET";
        var constructedURL = this.constructURL(API, params);
        axiosRetry(axios, { retries: this.retry });
        return axios.get(constructedURL, this.config);
     }

     post(API, params = this.defaultParams) {
         this.call = "POST";
        var constructedURL = this.constructURL(API, params);
        var body = params['body'];
        axiosRetry(axios, { retries: this.retry });
            return axios.post(constructedURL, body, this.config);
     }

     constructURL(API, params) {
         var constructedURL;
         var endpoint;
         console.log("DEBUG");
         console.log(API);
         if("repl_str" in params) {
         endpoint = format(this[API], params.repl_str)
         }
         else {
endpoint = this[API];
         }
if(this.env === 'local') {
    // Add some code to invalidate this if the call is POST
    if(this.call == "GET") {
    constructedURL = this.corsString + this.localBaseUrlString + endpoint;
    }
    else if(this.call == "POST") {
        constructedURL = this.localBaseUrlString + endpoint;
    }
}
else if(this.env === 'dev') {
    constructedURL = this.devBaseUrlString + endpoint;
}
else if(this.env === 'prod') {
    constructedURL = this.prodBaseUrlString + endpoint;
}

if("query" in params) {
    constructedURL = this.queryProcess(constructedURL, params);
}

return constructedURL;
     }

     queryProcess(constructedURL, params) {
        var argumentStr = "?";
        var count = 0;
        const keys = Object.keys(params['query'])
        for (const key of keys) {
            if(count !== 0) {
                argumentStr += "&";
            }
          argumentStr += key + "=" + params['query'][key];
          count++;
        }
        constructedURL = constructedURL + argumentStr;
        //alert(constructedURL);
        return constructedURL;
     }

  }

  export default SLAPI;