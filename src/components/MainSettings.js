import React, { Component } from "react";
import API from "./API";
import axios from "axios";
import { connect } from "react-redux";
import Loading from "./Loading";
import Support from "./Support";
import Toggle from "react-toggle";
import { Link } from "react-router-dom";
import "../styles/toggle.css";
import { withKeycloak } from "react-keycloak";
import axiosRetry from "axios-retry";
import Sidebar from "react-sidebar";
import { openSideBar } from "../actions/sidebar";
import { bindActionCreators } from "redux";
import { push } from "connected-react-router";

/**
 * Merge into FavMerchantsItem? This is a little more duplication than I am comfortable with
 */
class FavMerchantsCircle extends React.Component {
  state = {
    merchant: this.props.merchant
  };

  routeChange = () => {
    console.log("route change?");
    let path = "/detail/" + this.state.merchant.id;
    this.props.dispatch(push(path));
  };

  render() {
    //console.log(this.state);

    if (!this.state.merchant) {
      return <Loading />;
    }

    return (
      <img
        onClick={this.routeChange}
        className="fav-logo"
        src={this.state.merchant.logo}
      />
    );
  }
}

class MainSettings extends React.Component {
  state = {
    notificationEnabled: this.props.data.notificationEnabled,
    notificationEmailEnabled: this.props.data.notificationEmailEnabled,
    open: false
  };

  handleNotification = event => {
    event.persist();
    //console.log(event.target.checked);
    this.setState({ notificationEnabled: event.target.checked });

    var body = {
      notificationEnabled: event.target.checked
    };

    var api = new API(this.props.keycloak);
    api.setRetry(3);
    api
      .post("settings", { body: body })
      .then(response => console.log(response.data))
      .then(data =>
        this.setState({ notificationEnabled: event.target.checked })
      )
      .catch(function(error) {
        //console.log(error);
      });
  };

  handleNotificationEmail = event => {
    event.persist();

    var body = {
      notificationEmailEnabled: event.target.checked
    };
    var api = new API(this.props.keycloak);
    api
      .post("settings", { body: body })
      .then(response => console.log(response.data))
      .then(data =>
        this.setState({ notificationEmailEnabled: event.target.checked })
      )
      .catch(function(error) {
        //console.log(error);
      });
  };

  /*
   * Is this very "react"? Possible refactor alongside FavMerchants.js
   */
  loadFavMerchants(data) {
    //console.log(data);
    var arr = [];
    data.map((item, index) => {
      if (index < 3) {
        console.log("ITEMS");
        console.log(item);
        arr.push(
          <FavMerchantsCircle {...this.props} merchant={item} key={item.id} />
        );
      }
    });
    this.setState({ favs: arr });
  }

  componentDidMount() {
    console.log("MAIN SETTINGS DEEPLINK");
    if (window.IonicDeeplink) {
      window.IonicDeeplink.onDeepLink(function(data) {
        console.log("get my data!");
        console.log(data);
      });
    }

    var query = {
      lat: this.props.coordinates.coords.latitude,
      lng: this.props.coordinates.coords.longitude,
      limit: "30"
    };

    var api = new API(this.props.keycloak);
    api
      .get("favoriteMerchantAPI", { query: query })
      .then(response => this.loadFavMerchants(response.data))
      .catch(function(error) {
        console.log(error);
      });
  }

  constructor(props) {
    super(props);
    this.onSetOpen = this.onSetOpen.bind(this);
  }
  onSetOpen(open) {
    this.props.openSideBar(open);
  }

  componentWillUnmount() {
    this.props.openSideBar(false);
  }

  test = e => {
    console.log(e);
  };

  render() {
    return (
      <ul className="main-settings">
        <Sidebar
          sidebar={<Support onSetOpen={this.onSetOpen} />}
          open={this.props.sidebar}
          rootClassName={"sb-root"}
          sidebarClassName={"sb-sb"}
          contentClassName={"sb-content"}
          overlayClassName={"sb-overlay"}
          styles={{
            content: { boxShadow: "none" },
            sidebar: { boxShadow: "none", width: "50%", zIndex: "100" },
            dragHandle: { boxShadow: "none" },
            root: { boxShadow: "none" },
            overlay: {
              width: "50%",
              zIndex: "99",
              borderRadius: "0px 0px 0px 30px",
              left: "auto",
              backgroundColor: "rgba(221, 221, 221, .9)"
            }
          }}
          pullRight={true}
          defaultSidebarWidth={100}
        >
          <span />
        </Sidebar>
        <div className="fav-merchant-item">{this.state.favs}</div>
        <Link to="/favmerchants/" className="fav-merchant-link">
          <div className="fav-merchants" onClick={this.test}>
            <span className="merchant-number">
              {this.props.data.profile.merchantCount}
            </span>
            <div className="fav-merchants-text">
              Favorite Merchants
              <div className="right-arrow" />
            </div>
          </div>
        </Link>

        {/*<li>Waitlist</li>*/}
        <li>
          <label>
            <span className="toggle-text">Notifications</span>
            <Toggle
              icons={{
                checked: null,
                unchecked: null
              }}
              className="toggle-shoployal"
              defaultChecked={this.state.notificationEnabled}
              onChange={this.handleNotification}
            />
          </label>
        </li>
        <li>
          <label>
            <span className="toggle-text">Email Notifications</span>
            <Toggle
              icons={{
                checked: null,
                unchecked: null
              }}
              className="toggle-shoployal"
              defaultChecked={this.state.notificationEmailEnabled}
              onChange={this.handleNotificationEmail}
            />
          </label>
        </li>

        <Link to="/contact/">
          <li className="support-button">
            <span className="setting-link">Support</span>
          </li>
        </Link>
        <Link to="/tutorial/">
          <li>
            <span className="setting-link">Tutorial</span>
          </li>
        </Link>
      </ul>
    );
  }
}

const mapStateToProps = state => {
  return {
    sidebar: state.sidebar,
    coordinates: state.coordinates
  };
};

function mapDispatchToProps(dispatch) {
  let actions = bindActionCreators({ openSideBar }, dispatch);
  return { ...actions, dispatch };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withKeycloak(MainSettings));
