import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import auth, * as fromAuth from './auth.js'
import general from './general.js'
import {author} from './general.js'
import LocationReducer from './location.js'
import { reducer as oidcReducer } from 'redux-oidc';
export default (history) => combineReducers({
        auth: auth,
  router: connectRouter(history),
  general: general,
  oidc: oidcReducer,
  coordinates: LocationReducer,
})
export const isAuthenticated =
 state => fromAuth.isAuthenticated(state.auth)
export const accessToken = 
  state => fromAuth.accessToken(state.auth)
export const isAccessTokenExpired =
  state => fromAuth.isAccessTokenExpired(state.auth)
export const refreshToken =
  state => fromAuth.refreshToken(state.auth)
export const isRefreshTokenExpired =
  state => fromAuth.isRefreshTokenExpired(state.auth)
export const authErrors =
  state => fromAuth.errors(state.auth)
  
export function withAuth(headers={}) {
  return (state) => ({
    ...headers,
    'Authorization': `Bearer ${accessToken(state)}`
  })
}