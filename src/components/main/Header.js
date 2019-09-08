import React, { Component } from "react";
import { Link } from "react-router-dom";
import ShopLoyalMainImg from "../../resources/img/ShopLoyalMain.png";
import ProfilePic from "../../resources/img/profile-pic.png";
import Search from "./Search";
import { connect } from "react-redux";
import API from "../../utils/API";
import { withKeycloak } from "react-keycloak";
import Back from "./Back";
import { profileSave } from "../../redux/actions/profile";
import { openSideBar } from "../../redux/actions/sidebar";
import { bindActionCreators } from "redux";
import { Welcome } from "../../config/strings";

class FrontPage extends Component {
  state = {
    picture: ProfilePic,
    pictureLoaded: false
  };

  componentDidMount() {
    if (this.props.profile && this.state.pictureLoaded === false) {
      this.setState({
        picture: this.props.profile.picture,
        pictureLoaded: true
      });
    }
  }

  componentDidUpdate() {
    if (this.props.profile && this.state.pictureLoaded === false) {
      this.setState({
        picture: this.props.profile.picture,
        pictureLoaded: true
      });
    }
  }

  render() {
    var navStyles = {
      justifyContent: "left"
    };

    return (
      <div>
        <nav style={navStyles}>
        </nav>
        <Link to="/">
          <img className="logo shoployal-main-logo" src={ShopLoyalMainImg} />
        </Link>
        <div className="secondary-nav">
          <div className="welcome-text" style={navStyles}>
            {Welcome}
            <span className="welcome-text-name">
              {this.props.keycloak.tokenParsed.given_name}
            </span>
          </div>
          <Link to="/settings">
            <img className="profile-picture" src={this.state.picture} />
          </Link>
        </div>
        <Search />
        <hr className="hr-header" />
      </div>
    );
  }
}

const SearchPage = () => (
  <div>
    <Back />
    <Search />
    <hr className="hr-header" />
  </div>
);

const NonSearchPage = () => <Back />;
class NonSearchPageHamburger extends Component {
  render() {
    return (
      <div className="hamburger-container">
        <span
          onClick={() => this.props.openSideBar(true)}
          className="fa fa-bars"
        />
        <Back />
      </div>
    );
  }
}

const HeaderToUrl = {
  frontPage: ["/"],
  searchPage: ["/cards", "/map", "/detail"],
  nonSearchPage: ["/chat", "/support", "/privacy", "/error"],
  nonSearchPageHamburger: ["/settings"]
};

const HeaderComponents = {
  frontPage: FrontPage,
  searchPage: SearchPage,
  nonSearchPage: NonSearchPage,
  nonSearchPageHamburger: NonSearchPageHamburger
};

class Header extends Component {
  getHeaderComponent() {
    let path = this.props.router.location.pathname;
    for (const headerType in HeaderToUrl) {
      if (HeaderToUrl[headerType].includes(path)) {
        const component = HeaderComponents[headerType];
        return component;
      }
    }
    return NonSearchPage;
  }

  state = {
    headerLoc: false
  };

  configuration(data) {
    this.setState({ profile: data });
    this.props.profileSave(data);
  }

  setHeader() {
    if (this.props.keycloak.authenticated && this.props.profile === null) {
      // Combine the props and state things here, as well as elsewhere eventually

      //console.log(this.props);

      let api = new API(this.props.keycloak);
      api
        .get("userProfileAPI")
        .then(response => this.configuration(response.data))
        .catch(function (error) {
          console.log(error);
        });
    } else if (
      this.props.keycloak.authenticated &&
      this.props.profile !== null
    ) {
      this.setState({ profile: this.props.profile });
    }
  }

  componentDidMount() {
    if (
      this.props.router.location.pathname === "/" &&
      this.props.keycloak.authenticated
    ) {
      this.setState({ headerLoc: true });
      this.setHeader();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.router.location.pathname === "/" &&
      this.state.headerLoc === false
    ) {
      this.setHeader();
      this.setState({ headerLoc: true });
    } else if (
      this.props.router.location.pathname !== "/" &&
      this.state.headerLoc === true
    ) {
      this.setState({ headerLoc: false });
    }
  }

  render() {
    if (!this.props.keycloak.authenticated) {
      return <div />;
    }
    var navStyles = {
      justifyContent: "left"
    };

    const ComponentToRender = this.getHeaderComponent();
    return (
      <header>
        <ComponentToRender {...this.props} profile={this.state.profile} />

        {/*<img className="profile" src={ProfileImg} />*/}
      </header>
    );
  }
}

const mapStateToProps = state => {
  return {
    profile: state.profile,
    router: state.router
  };
};

function mapDispatchToProps(dispatch) {
  let actions = bindActionCreators({ profileSave, openSideBar }, dispatch);
  return { ...actions, dispatch };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withKeycloak(Header));
