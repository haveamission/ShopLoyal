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
      favoriteMerchantData: [],
      isLoading: true,
      position: {
        latitude: 0,
        longitude: 0
      },
      renderedThings: [],
      itemsRendered: 0,
      search: "",
    };
  }

  /**
   * Loads favorite merchants
   */
  loadMerchants() {
    let api = new API(this.props.keycloak);
    api.setRetry(3);
    let query = {
      lat: this.props.coordinates.coords.latitude,
      lng: this.props.coordinates.coords.longitude,
      radius: smallRadius,
      limit: smallLimit,
      search: this.state.search
    };
    api
      .get("favoriteMerchantAPI", { query: query })
      .then(response => this.favoriteMerchantConfiguration(response.data))
      .catch(function (error) {
        console.log(error);
      });
  }

  componentWillMount() {
    this.props.searchSave("");
  }

  componentWillUnmount() {
    window.scrollTo(0, 0);
    clearTimeout(this.timer);
  }

  /**
   * If favorite merchant data changes, schedule the next render update
   */
  componentDidUpdate(prevProps, prevState) {
    if (this.state.favoriteMerchantData !== prevState.favoriteMerchantData) {
      this.scheduleNextUpdate();
    }
  }

  favoriteMerchantConfiguration(favoriteMerchantData) {
    let idArray = favoriteMerchantData.map(a => a.id);
    this.props.saveMessageNum(idArray);
    this.setState({ favoriteMerchantData: favoriteMerchantData, isLoading: false });
  }

  /**
   * TODO - move to initialization component
   */
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
    setTimeout(() => {
      this.updateRenderedThings();
    }, 750);
  }

  /**
   * Updates the items that are rendered after .75 seconds. This is to emulate a "shuffling" motion
   */
  updateRenderedThings() {
    if (typeof this.state !== "undefined" && this.state.favoriteMerchantData.length) {
      const itemsRendered = this.state.itemsRendered;
      const updatedState = {
        renderedThings: this.state.renderedThings.concat(
          this.state.favoriteMerchantData[this.state.itemsRendered]
        ),
        itemsRendered: itemsRendered + 1
      };
      this.setState(updatedState);
      if (updatedState.itemsRendered < this.state.favoriteMerchantData.length) {
        this.scheduleNextUpdate();
      }
    }
  }

  setSLDefaultFav() {
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

  componentDidMount() {

    if (this.props.keycloak.authenticated) {
      if (window.plugins) {
        window.plugins.OneSignal.getIds(this.extractOneSignalIds);
      }

      if (this.props.analytics.engagement === 1) {
        this.setSLDefaultFav();
      }
      else {
        this.loadMerchants();
      }

    }
  }

  render() {
    if (this.state.isLoading || this.state.renderedThings.length === 0) {
      return <Loading />;
    }
    return (
      <div className="cards">
        {this.state.renderedThings.map((merchant, index) => (
          <CardRow
            merchant={merchant}
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
