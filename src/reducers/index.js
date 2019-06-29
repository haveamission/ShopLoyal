import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import general from './general.js'
import {author} from './general.js'
import LocationReducer from './location.js'
import search from './search.js'
import categories from './categories.js'
import tokens from './tokens';
import profile from './profile.js'
import idprovider from './idprovider.js'
import firstFavorite from './firstFavorite.js'
export default (history) => combineReducers({
  router: connectRouter(history),
  general: general,
  search: search,
  profile: profile,
  tokens,
  categories: categories,
  coordinates: LocationReducer,
  idprovider: idprovider,
  firstFavorite: firstFavorite,
})