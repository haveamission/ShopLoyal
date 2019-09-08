import React, { Component } from "react";
import { connect } from "react-redux";
import { withKeycloak } from "react-keycloak";
import { bindActionCreators } from "redux";
import API from "../../utils/API";
import { saveMessageTotalNum } from "../../redux/actions/total_messages";


/**
 * Currently unused but may be used in the future
 **/

class BackgroundProcess extends Component {

  merchantMessageConfiguration(data) {
    let message_count = data.length;
    this.props.saveMessageTotalNum(this.props.total_messages + message_count);
  }

  pullMessages(self) {
    if (self.props.keycloak.authenticated) {
      let api = new API(self.props.keycloak);
      self.props.merchants.forEach(function (merchant_id) {
        api
          .get("merchantMessages", { repl_str: merchant_id })
          .then(response => self.merchantMessageConfiguration(response.data))
          .catch(function (error) {
            console.log(error);
          })
          .finally(function () {
            window.cordova.plugins.notification.badge.set(
              self.props.total_messages
            );
          });
      });
    }
  }

  componentDidMount() {
    const self = this;
    let fetchCallback = function () {
      // Required: Signal completion of your task to native code
      // If you fail to do this, the OS can terminate your app
      // or assign battery-blame for consuming too much background-time
      self.pullMessages(self);
      window.BackgroundFetch.finish();
    };

    let failureCallback = function (error) {
      console.log("- BackgroundFetch failed", error);
    };

    window.BackgroundFetch.configure(fetchCallback, failureCallback, {
      minimumFetchInterval: 15 // <-- default is 15
    });
  }

  render() {
    return <></>;
  }
}

const mapStateToProps = state => {
  return {
    merchants: state.messages,
    total_messages: state.total_messages
  };
};

function mapDispatchToProps(dispatch) {
  let actions = bindActionCreators({ saveMessageTotalNum }, dispatch);
  return { ...actions, dispatch };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withKeycloak(BackgroundProcess));
