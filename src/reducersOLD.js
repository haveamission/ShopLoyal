/*import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import auth, * as fromAuth from './reducers/auth.js'
//import general from './reducers/general.js'
import saveColor from './reducers/general.js'

export default (history) => combineReducers({
        auth: auth,
  router: connectRouter(history),
  //general: general,
  test: saveColor,
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
}*/