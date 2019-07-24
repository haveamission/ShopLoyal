import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import {author} from './general.js'
import LocationReducer from './location.js'
import search from './search.js'
import categories from './categories.js'
import tokens from './tokens';
import profile from './profile.js'
import idprovider from './idprovider.js'
import firstFavorite from './firstFavorite.js'
import analytics from './analytics.js'
import color from './color.js'
export default (history) => combineReducers({
  router: connectRouter(history),
  search: search,
  profile: profile,
  color: color,
  tokens,
  categories: categories,
  coordinates: LocationReducer,
  idprovider: idprovider,
  firstFavorite: firstFavorite,
  analytics: analytics,
})