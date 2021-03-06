import axios from "axios";
import axiosRetry from "axios-retry";
import format from "string-format";

class SLAPI {
  constructor(keycloak) {
    this.keycloak = keycloak;
    this.config = {
      headers: {
        Authorization: "Bearer " + this.keycloak.idToken,
        "Content-Type": "application/json",
      }
    };
    this.env = "prod";
    if (!window.cordova) {
      this.env = "local";
    }
    if (this.env === "local") {
      //this.config.headers["origin"] = "local";
    }
  }

  defaultParams = {
    repl_str: null,
    body: {},
    query: {}
  };

  call = null;
  retry = 1;

  setRetry(value) {
    this.retry = value;
  }

  corsString = "https://cors-anywhere.herokuapp.com/";
  localBaseUrlString = "https://api.v2.shoployal.com/api/v1";
  devBaseUrlString = "https://dev.apiv2.shoployal.com/api/v1";
  prodBaseUrlString = "https://api.v2.shoployal.com/api/v1";

  userNoticesAPI = "/users/me/notices";
  userPushRegisterAPI = "/users/me/register_device";
  userInvitesAPI = "/users/me/invites";
  userLogout = "/users/me/logout";
  userMessages = "/merchant/api/v1/users/{userId}/message";

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
    let constructedURL = this.constructURL(API, params);
    axiosRetry(axios, { retries: this.retry });
    return axios.get(constructedURL, this.config);
  }

  post(API, params = this.defaultParams) {
    this.call = "POST";
    let constructedURL = this.constructURL(API, params);
    let body = params["body"];
    axiosRetry(axios, { retries: this.retry });
    return axios.post(constructedURL, body, this.config);
  }

  constructURL(API, params) {
    let constructedURL;
    let endpoint;
    if ("repl_str" in params) {
      endpoint = format(this[API], params.repl_str);
    } else {
      endpoint = this[API];
    }
    if (this.env === "local") {
      // Add some code to invalidate this if the call is POST
      if (this.call === "GET") {
        constructedURL = this.corsString + this.localBaseUrlString + endpoint;
      } else if (this.call === "POST") {
        constructedURL = this.localBaseUrlString + endpoint;
      }
    } else if (this.env === "dev") {
      constructedURL = this.devBaseUrlString + endpoint;
    } else if (this.env === "prod") {
      constructedURL = this.prodBaseUrlString + endpoint;
    }

    if ("query" in params) {
      constructedURL = this.queryProcess(constructedURL, params);
    }

    return constructedURL;
  }

  queryProcess(constructedURL, params) {
    let argumentStr = "?";
    let count = 0;
    const keys = Object.keys(params["query"]);
    for (const key of keys) {
      if (count !== 0) {
        argumentStr += "&";
      }
      argumentStr += key + "=" + params["query"][key];
      count++;
    }
    constructedURL = constructedURL + argumentStr;
    return constructedURL;
  }
}

export default SLAPI;
