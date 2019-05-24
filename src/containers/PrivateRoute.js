import React from 'react'
import { Route, Redirect } from 'react-router'
import { connect } from 'react-redux'
import * as reducers from '../reducers'

const PrivateRoute = ({ component: Component, oidc, ...rest }) => (
  
  <Route {...rest} render={props => (
    oidc.user ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }}/>
    )
  )}/>
)
const mapStateToProps = (state) => {
  if (Object.keys(state.oidc).length === 0) {
state.oidc = {};
  }
  return {
    oidc: state.oidc
  };
};
export default connect(mapStateToProps, null)(PrivateRoute);