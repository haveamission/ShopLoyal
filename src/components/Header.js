import React from 'react'
import { Link } from 'react-router-dom'
import ShopLoyalImg from '../img/ShopLoyal.png'
import ShopLoyalMainImg from '../img/ShopLoyalMain.png'
import ProfileImg from '../img/profile.png'
import { Glyphicon } from 'react-bootstrap'
import Search from './Search'
import Categories from './Categories'
import { connect } from 'react-redux'
import API from './API'
import axios from 'axios';
import { withKeycloak } from 'react-keycloak';

// The Header creates links that can be used to navigate
// between routes.

class Header extends React.Component {

  state = {
    headerLoc: false,
  }

  configuration(data) {
    //console.log("set profile");
    //console.log(data);
      this.setState({profile: data});
  }

componentDidMount() {
  //console.log("HEADER STATE AND PROPS props");
  //console.log(this.props);
  //console.log(this.state);
  // Messy probably - clean it later
  //console.log(window.location.pathname);

  if(this.props.router.location.pathname === '/' && this.props.keycloak.authenticated) {
this.setState({headerLoc: true})

if(this.props.keycloak.authenticated) {
  let config = {
    headers: {
      Authorization: "Bearer " + this.props.keycloak.idToken,
    }
  }
    axios.get(API.prodBaseUrlString + API.userProfileAPI, config).then(
    response => this.configuration(response.data)
  ).catch(function(error) {
    //console.log("500 error here???");
    //console.log(error);
    //alert(error);
  });

}

  }
}

componentDidUpdate(prevProps, prevState) {
  if(this.props.router.location.pathname === '/' && this.state.headerLoc == false) {
    if(this.props.keycloak.authenticated) {
      let config = {
        headers: {
          Authorization: "Bearer " + this.props.keycloak.idToken,
        }
      }
        axios.get(API.prodBaseUrlString + API.userProfileAPI, config).then(
        response => this.configuration(response.data)
      ).catch(function(error) {
        //console.log("500 error here???");
        //console.log(error);
        //alert(error);
      });
    
    }
    this.setState({headerLoc: true})
    
    }
    else if (this.props.router.location.pathname !== '/' && this.state.headerLoc == true) {
      this.setState({headerLoc: false})
    }
    
    
      }

  render() {
    if(!this.props.keycloak.authenticated) {
      return <div></div>
    }
    var navStyles = {
      justifyContent: "left",
    }

    //console.log("state during render");
    //console.log(this.state);
    
  return(
  <header>
    <nav style={navStyles}>
      

      {/*<img className="profile" src={ProfileImg} />*/}

    </nav>
    <Link to="/"><img className="logo shoployal-main-logo" src={ShopLoyalMainImg} /></Link>
    {this.state.headerLoc ? (
      <div className="secondary-nav">
       <div className="welcome-text" style={navStyles}>
       Welcome
       <span className="welcome-text-name">{this.props.keycloak.tokenParsed.given_name}</span>
       </div>
       {this.state.profile ? (
       <Link to="/settings"><img className="profile-picture" src={this.state.profile.picture} /></Link> )
       : (
         null
       )}
       <div className="fav-merch-text">Add your favorite local merchants</div>
       </div>
      ) : (
    null
      )}
    <Search />
    <hr className="hr-header" />
  </header>
)
  }
}

const mapStateToProps = (state) => {
  return {
    //oidc: state.oidc,
    router: state.router,
  };
};

export default connect(mapStateToProps)(withKeycloak(Header));