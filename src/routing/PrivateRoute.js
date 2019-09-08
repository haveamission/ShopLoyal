import React, { Component } from "react";
import { Route, Redirect } from "react-router";
import { connect } from "react-redux";
import { withKeycloak } from "react-keycloak";
import searchSave from "../redux/actions/search";
import { bindActionCreators } from "redux";

class PrivateRoute extends Component {
  render() {
    if (this.props.keycloak.authenticated) {
      return (
        <Route
          {...this.props}
          render={<this.props.component {...this.props} />}
        />
      );
    } else if (this.props.idprovider) {
      this.props.keycloak.login({
        idpHint: this.props.idprovider,
        cordovaOptions: { zoom: "no", hardwareback: "yes" },
      });
    }
    return (
      <Redirect
        to={{
          pathname: "/login",
          state: { from: this.props.location }
        }}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    idprovider: state.idprovider
  };
};

function mapDispatchToProps(dispatch) {
  let actions = bindActionCreators({ searchSave }, dispatch);
  return { ...actions, dispatch };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withKeycloak(PrivateRoute));
