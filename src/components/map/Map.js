import React, { Component } from "react";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";
import Business from "../cards/Business";
import SwipeToDismiss from "react-swipe-to-dismiss";
import API from "../../utils/API";
import { connect } from "react-redux";
import searchSave from "../../redux/actions/search";
import { bindActionCreators } from "redux";
import getLocation from "../../redux/actions/location";
import Loading from "../main/Loading";
import Categories from "./Categories";
import { withKeycloak } from "react-keycloak";
import { push } from "connected-react-router";
import { toast } from "react-toastify";
import { useSpring, animated } from "react-spring";
import { NoResults } from '../../config/string';

function SlideLeft(props) {
  const animationProps = useSpring({
    from: { transform: "translate3d(100%,0,0)" },
    to: { transform: "translate3d(0%,0,0)" }
  });

  return (
    <animated.div style={{ ...animationProps }}>
      {" "}
      {props.children}{" "}
    </animated.div>
  );
}

const mapStyles = {
  width: "100%",
  height: "77vh"
};

function search(nameKey, myArray) {
  for (let i = 0; i < myArray.length; i++) {
    if (myArray[i].id === nameKey) {
      return myArray[i];
    }
  }
}

export class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      data: { merchants: [] },
      selectedMerchant: null,
      rerendered: 0,
      marginTop: 0,
      bottom: "-50rem",
      businessMerchants: [],
      businessClass: "slide-in"
    };
    this.handleBusinessPop = this.handleBusinessPop.bind(this);
  }

  toastId = "no-merchant";

  launchErrorModal() {
    if (!toast.isActive(this.toastId) && this.props.search.search !== "") {
      this.toastId = toast.error(
        { NoResults },
        {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
          toastId: this.toastId
        }
      );
    }
  }

  componentWillUnmount() {
    this.props.searchSave("");
  }

  componentWillMount() {
    let centerLat = this.props.coordinates.coords.latitude;
    let centerLng = this.props.coordinates.coords.longitude;

    // This should be a good enough check for now about whether latitude and longitude are defined
    // Possibly make this more robust later
    if (typeof this.props.location.state !== "undefined") {
      centerLat = this.props.location.state.merchant_lat;
      centerLng = this.props.location.state.merchant_lng;
    }
    this.setState({ centerLat: centerLat, centerLng: centerLng });
  }

  onMarkerClick = (props, marker, e) => {
    let selectedMerchant = search(
      parseInt(marker.title),
      this.state.data.merchants
    );
    this.setState({ selectedMerchant: selectedMerchant });
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
      showResults: true
    });
  };

  onMapClicked = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
    this.setState({ showResults: true });
    if (typeof window.Keyboard.hide !== "undefined") {
      window.Keyboard.hide();
    }
  };

  mapIconLoad() {
    // TODO - expand radius gradually if nothing is in the area
    let radius = 10.0;
    let search = this.props.category.category;
    if (this.props.search.search !== null && this.props.search.search !== "") {
      radius = 30.0;
      search = this.props.search.search;
    }
    if (this.props.keycloak.authenticated) {
      let api = new API(this.props.keycloak);
      api.setRetry(3);
      let query = {
        lat: this.state.centerLat,
        lng: this.state.centerLng,
        radius: radius,
        limit: "10",
        search: search
      };
      api
        .get("merchantAPI", { query: query })
        .then(response => this.configuration(response.data))
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.rerendered < 2) {
      this.setState({ rerendered: this.state.rerendered + 1 });
    }
    if (
      this.state.updatedSearch === this.props.search.search &&
      this.state.updatedCategories === this.props.category.category
    ) {
      return;
    }
    if (
      this.state.updatedSearch !== this.props.search.search &&
      this.state.businessClass !== "slide-underneath"
    ) {
      this.setState({ businessClass: "slide-underneath" });
    }
    this.mapIconLoad();
  }

  configuration(data) {
    let filteredMerchants = data.merchants.filter(function (returnableObjects) {
      if (
        returnableObjects.subscriptionStatus === "active" ||
        returnableObjects.subscriptionStatus === "trialing"
      ) {
        return returnableObjects.subscriptionStatus;
      }
    });
    if (filteredMerchants.length === 0) {
      this.launchErrorModal();
    }
    data.merchants = filteredMerchants;
    this.setState({
      data: data,
      updatedSearch: this.props.search.search,
      updatedCategories: this.props.category.category,
      selectedMerchant: data.merchants[0]
    });
    // Separate logic for this, to allow for the animation to proceed
    if (this.state.businessMerchants.length < 2) {
      this.setState({ businessMerchants: data.merchants.slice(0, 2) });
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.mapIconLoad();
    if (typeof window.Keyboard.show !== "undefined") {
      window.Keyboard.show();
    }

    window.addEventListener("keyboardDidHide", event => {
      this.setState({ marginBottom: "6rem", bottom: "-50rem" });
    });

    window.addEventListener("keyboardDidShow", event => {
      this.setState({
        marginBottom: event.keyboardHeight,
        bottom: "-51rem"
      });
    });
  }

  handleBusinessPop() {
    this.setState({ businessMerchants: this.state.data.merchants.slice(0, 2) });
    this.setState({ businessClass: "slide-in" });
  }

  render() {
    if (this.state.rerendered < 2) {
      return <Loading />;
    }

    return (
      <div>
        <SlideLeft>
          <Categories />
        </SlideLeft>
        <div className="gmaps">
          <Map
            google={this.props.google}
            zoom={12}
            style={mapStyles}
            initialCenter={{
              lat: this.state.centerLat,
              lng: this.state.centerLng
            }}
            zoomControl={false}
            mapTypeControl={false}
            streetViewControl={false}
            fullscreenControl={false}
            gestureHandling="greedy"
            onClick={() => this.onMapClicked()}
          >
            {this.state.data.merchants.map(merchant => (
              <Marker
                title={String(merchant.id)}
                name={merchant.name}
                position={{ lat: merchant.latitude, lng: merchant.longitude }}
                onClick={() => {
                  this.props.dispatch(push("/detail/" + merchant.id));
                }}
                icon={{
                  url: merchant.logo,
                  scaledSize: new this.props.google.maps.Size(64, 64)
                }}
                key={merchant.id}
                style={{ zIndex: 100 }}
              />
            ))}
          </Map>
          <div
            className="business-cards"
            style={{
              marginBottom: this.state.marginBottom,
              bottom: this.state.bottom
            }}
          >
            {this.state.rerendered >
              1 /*&& this.state.data.merchants.length !== 0*/
              ? this.state.businessMerchants.map(merchant => (
                <Business
                  className={this.state.businessClass}
                  merchant={merchant}
                  handleBusinessPop={this.handleBusinessPop}
                />
              ))
              : ""}
          </div>
          <h3>{this.state.showResults ? <Results /> : null}</h3>
        </div>
      </div>
    );
  }
}

export class Results extends Component {
  render() {
    return (
      <div id="results" className="search-results">
        Some Results
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    search: state.search,
    coordinates: state.coordinates,
    category: state.categories
  };
};

function mapDispatchToProps(dispatch) {
  let actions = bindActionCreators({ searchSave, getLocation }, dispatch);
  return { ...actions, dispatch };
}

const LoadingContainer = props => <div />;

export default GoogleApiWrapper({
  apiKey: "AIzaSyC8ayoSBFNdHdORkbiteD5feHhpLYsToWE",
  LoadingContainer: LoadingContainer
})(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withKeycloak(MapContainer))
);
