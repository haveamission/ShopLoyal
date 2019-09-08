import React, { Component } from "react";
import CardRow from "./CardRow";
import API from "../../utils/API";
import { connect } from "react-redux";
import Loading from "../main/Loading";
import { withKeycloak } from "react-keycloak";
import { saveMessageNum } from "../../redux/actions/messages";
import { bindActionCreators } from "redux";
import searchSave from "../../redux/actions/search";
import { ShopLoyalMerID, smallRadius, smallLimit } from "../../config/constants"

/**
 * All of the card rows are contained inside here
 */
class Cards extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      isLoading: true,
      position: {
        latitude: 0,
        longitude: 0
      },
      renderedThings: [],
      itemsRendered: 0,
      search: "",
      SLloaded: false,
    };
  }

  loadMerchants() {

    let api = new API(this.props.keycloak);
    api.setRetry(3);
    let query = {
      lat: this.props.coordinates.coords.latitude,
      lng: this.props.coordinates.coords.longitude,
      radius: smallRadius,
      limit: smallLimit,
      // TODO: Change this to be consistent with other search values
      search: this.state.search
    };
    api
      .get("favoriteMerchantAPI", { query: query })
      .then(response => this.configuration(response.data))
      .catch(function (error) {
        console.log(error);
      });

    this.setState({ SLloaded: true });
  }

  componentWillMount() {
    this.props.searchSave("");
  }

  componentWillUnmount() {
    // indicate that the component has been unmounted
    window.scrollTo(0, 0);
    clearTimeout(this.timer);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.data !== prevState.data) {
      this.scheduleNextUpdate();
    }
  }

  configuration(data) {
    let idArray = data.map(a => a.id);
    this.props.saveMessageNum(idArray);
    this.setState({ data, isLoading: false });
  }

  extractOneSignalIds(ids) {
    let api = new API(this.props.keycloak);
    let query = {
      deviceId: ids.userId
    };
    api
      .post("userPushRegisterAPI", { query: query })
      .then(response => console.log(response.data))
      .catch(function (error) {
        console.log(error);
      });
  }

  scheduleNextUpdate() {
    //this.timer = setTimeout(this.updateRenderedThings, 1000);
    setTimeout(() => {
      this.updateRenderedThings();
    }, 750);
  }

  updateRenderedThings() {
    if (typeof this.state !== "undefined" && this.state.data.length) {
      const itemsRendered = this.state.itemsRendered;
      const updatedState = {
        renderedThings: this.state.renderedThings.concat(
          this.state.data[this.state.itemsRendered]
        ),
        itemsRendered: itemsRendered + 1
      };
      this.setState(updatedState);
      if (updatedState.itemsRendered < this.state.data.length) {
        this.scheduleNextUpdate();
      }
    }
  }

  componentDidMount() {

    if (this.props.keycloak.authenticated) {
      // Likely replace for inside the BackgroundProcess.js/Init/AfterLogin?
      if (window.plugins) {
        window.plugins.OneSignal.getIds(this.extractOneSignalIds);
      }

      if (this.props.analytics.engagement === 1) {
        let api = new API(this.props.keycloak);
        let body = {
          merchantId: ShopLoyalMerID,
          status: true
        };
        api
          .post("favoriteMerchantAPI", { body: body })
          .then(response => this.loadMerchants())
          .catch(function (error) {
            console.log(error);
          });
      }
      else {
        this.loadMerchants();
      }

    }
  }

  if(error) {
    return <p>{error.message}</p>;
  }

  render() {
    if (this.state.isLoading || this.state.renderedThings.length === 0 || this.state.SLloaded === false) {
      return <Loading />;
    }
    return (
      <div className="cards">
        {this.state.renderedThings.map((merchant, index) => (
          <CardRow
            merchant={{ merchant }}
            count={index}
            className={"card-color-" + index}
            key={index}
          />
        ))}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    router: state.router,
    tokens: state.tokens,
    coordinates: state.coordinates,
    analytics: state.analytics,
  };
};

function mapDispatchToProps(dispatch) {
  let actions = bindActionCreators(
    { saveMessageNum, searchSave },
    dispatch
  );
  return { ...actions, dispatch };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withKeycloak(Cards));
