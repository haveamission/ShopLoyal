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
      // TODO: This logic is tortured, and should be cleaned and refactored time permitting
      (rest.idprovider ? (
        rest.keycloak.login({idpHint: rest.idprovider, cordovaOptions: { zoom: "no", hardwareback: "yes" }}),
        <Redirect to={{
          pathname: '/login',
          state: { from: props.location }
        }}/>
        ):(
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }}/>))
    )
  )}/>
)

    const mapStateToProps = (state) => {
        return {
          idprovider: state.idprovider
        };
      };

export default connect(mapStateToProps)(withKeycloak(PrivateRoute));
