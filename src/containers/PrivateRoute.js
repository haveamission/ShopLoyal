import React from 'react'
import { Route, Redirect } from 'react-router'
import { connect } from 'react-redux'
import * as reducers from '../reducers'
import { withKeycloak } from 'react-keycloak';

const PrivateRoute = ({ component: Component, ...rest }) => (

  <Route {...rest} render={props => (
    //alert("SHOULD get here - before this props"),
    //alert("props"),
    //alert(JSON.stringify(props)),
    //alert("rest"),
    //alert(JSON.stringify(rest)),
    //alert("Component"),
    //alert(JSON.stringify(<Component />)),
    rest.keycloak.authenticated ? (
      //alert("Should NOT get here"),
      //alert(JSON.stringify(...props)),
      <Component {...props}/>
    ) : (
      //alert("should get to login redirect"),
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }}/>
    )
  )}/>
)
export default withKeycloak(PrivateRoute);
