import React from "react";
import { connect } from "react-redux";
import { CallbackComponent } from "redux-oidc";
import { push } from 'connected-react-router'
import userManager from '../config/OIDC';
import {bindActionCreators} from 'redux'
import {author} from '../actions/general'
import axios from 'axios'


class CallbackPage extends React.Component {
 successCallback = (user) => {
    console.log(user);
    console.log("GONGXIGONGXI");
    var accessToken = user ? user.access_token : undefined;
    var bearer = "Bearer " + accessToken; // This can be added to the Authorization Header
console.log(bearer);
axios.defaults.headers.common['Authorization'] = bearer;
    this.setState({author: bearer});

    console.log(this.state);

    console.log(this.props);

    this.props.dispatch(author(bearer));

    this.props.dispatch(push("/"));
  };
  render() {
    // just redirect to '/' in both cases
    return (
      <CallbackComponent
        userManager={userManager}
        successCallback={this.successCallback}
        errorCallback={error => {
          //this.props.dispatch(push("/chat"));
          console.error(error);
        }}
        >
        <div>Redirecting...</div>
      </CallbackComponent>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    bearer: state.author
  };
};

function mapDispatchToProps(dispatch) {
  let actions = bindActionCreators({ author });
  return { ...actions, dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(CallbackPage);