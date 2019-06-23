import React from 'react'
import { Route, Redirect } from 'react-router'
import { connect } from 'react-redux'
import * as reducers from '../reducers'
import { withKeycloak } from 'react-keycloak';

const PrivateRoute = ({ component: Component, ...rest }) => (

  <Route {...rest} render={props => (
    rest.keycloak.authenticated ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }}/>
    )
  )}/>
)
export default withKeycloak(PrivateRoute);
