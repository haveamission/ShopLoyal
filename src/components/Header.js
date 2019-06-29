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
import { withKeycloak } from 'react-keycloak';
import Back from './Back';
import {profileSave} from '../actions/profile';
import {bindActionCreators} from 'redux'

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
      this.props.profileSave(data);
      
  }

  setHeader() {
    if(this.props.keycloak.authenticated && this.props.profile === null) {

      // Combine the props and state things here, as well as elsewhere eventually

      console.log(this.props);

      var api = new API(this.props.keycloak);
      api.get("userProfileAPI").then(
        response => this.configuration(response.data)
        ).catch(function(error) {
        console.log(error);
        })
    }
    else if(this.props.keycloak.authenticated && this.props.profile !== null) {
      this.setState({profile: this.props.profile});
    }
  }

componentDidMount() {
  //console.log("HEADER STATE AND PROPS props");
  //console.log(this.props);
  //console.log(this.state);
  // Messy probably - clean it later
  //console.log(window.location.pathname);

  if(this.props.router.location.pathname === '/' && this.props.keycloak.authenticated) {
this.setState({headerLoc: true})
this.setHeader();
  }
}

componentDidUpdate(prevProps, prevState) {
  if(this.props.router.location.pathname === '/' && this.state.headerLoc == false) {
    this.setHeader();
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
<Back />
      )}
    <Search />
    <hr className="hr-header" />
    {this.state.headerLoc ? (
      null
    ): (
null
    )}
  </header>
)
  }
}


const mapStateToProps = (state) => {
  return {
    profile: state.profile,
    router: state.router,
  };
};

function mapDispatchToProps(dispatch) {
  let actions =  bindActionCreators({ profileSave }, dispatch);
  return { ...actions, dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(withKeycloak(Header));