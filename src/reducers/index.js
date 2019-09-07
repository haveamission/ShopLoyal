import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import LocationReducer from "./location.js";
import search from "./search.js";
import categories from "./categories.js";
import profile from "./profile.js";
import idprovider from "./idprovider.js";
import firstFavorite from "./firstFavorite.js";
import analytics from "./analytics.js";
import color from "./color.js";
import sidebar from "./sidebar.js";
import tokens from "./tokens.js";
import messages from "./messages.js";
import total_messages from "./total_messages.js";
import onesignal from "./onesignal.js";
export default history =>
  combineReducers({
    router: connectRouter(history),
    search,
    profile,
    color,
    categories,
    coordinates: LocationReducer,
    idprovider,
    firstFavorite,
    analytics,
    sidebar,
    messages,
    total_messages,
    onesignal,
    tokens
  });
