import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import Iframe from 'react-iframe'
import Page from './Page'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBowlingBall } from '@fortawesome/free-solid-svg-icons'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { faImages, faImage } from '@fortawesome/free-solid-svg-icons'
import { ClipLoader } from 'react-spinners';
import userManager from '../config/OIDC';
import { connect } from "react-redux";
import API from './API'
import axios from 'axios';
import { push } from 'connected-react-router'

class Settings extends Component {

  state = {
    profile: {},
  }

  configuration(data) {
this.setState({profile: data});
  }


  componentDidMount() {

    if(this.props.oidc.user) {

let config = {
  headers: {
    Authorization: "Bearer " + this.props.oidc.user.access_token,
  }
}
    

axios.get(API.localBaseUrlString + API.userProfileAPI, config).then(
  response => this.configuration(response.data)
);
  }
  else {
   // this.props.dispatch(push("/login"));
  }
}

  render() {
    console.log(this.state);
    if (Object.keys(this.state.profile).length === 0) {
      console.log("gets triggered");
      return (
        <Page>
        <div />
        </Page>
      )
  }

    return (
        <Page>
  <div className="settings">
      <ProfileSettings profile={this.state.profile}/>
      <MainSettings profile={this.state.profile} />
      <LogoutSettings />
  </div>
  </Page>
)
  }
}

const mapStateToProps = (state) => {
  return {
    oidc: state.oidc
  };
};

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default connect(mapStateToProps)(Settings);

class ProfileSettings extends React.Component {
  onLoginButtonClick(event) {
    event.preventDefault();
    userManager.signinRedirect();
  }



  render() {

    console.log(this.props);
    return (
<div>
<button onClick={this.onLoginButtonClick}>Login with Google</button>
<h3 className="profile-name">{this.props.profile.name}</h3>
<div className="profile-email">{this.props.profile.email}</div>
</div>
  )
}
}

class MainSettings extends React.Component {
  render() {
    return(
    <ul className="main-settings">
    <div className="fav-merchants">
    <span className="merchant-number">{this.props.profile.merchantCount}</span>
    <div className="fav-merchants-text">Favorite Merchants</div>
    </div>
<Link to="/support/"><li>Support</li></Link>
<li>Waitlist</li>
<li>Notifications</li>
<li>Email Notifications</li>

    </ul>
  )
}
}

  const LogoutSettings = () => (
    <ul className="logout-settings">
<li className="list-bottom">Log Out</li>
    </ul>
  )

class Spinner extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        loading: true
      }
    }
    render() {
      return (
        <div className='sweet-loading'>
          <ClipLoader
            sizeUnit={"px"}
            size={50}
            color={'#123abc'}
            loading={this.state.loading}
          />
        </div> 
      )
    }
  }
  
const Images = (props) => ( 
  props.images.map((image, i) =>
    <div key={i} className='fadein'>
      <div 
        onClick={() => props.removeImage(image.public_id)} 
        className='delete'
      >
        <FontAwesomeIcon icon={faTimesCircle} size='2x' />
      </div>
      <img src={image.secure_url} alt='' />
    </div>
  )
  );
  
const Buttons = (props) => (
  <div className='buttons fadein'>
    <div className='button'>
      <label htmlFor='single'>
        <FontAwesomeIcon icon={faImage} color='#3B5998' size='10x' />
      </label>
      <input type='file' id='single' onChange={props.onChange} /> 
    </div>
  </div>
  );

 class UploadImage extends Component {
  
    state = {
      uploading: false,
      images: []
    }
  
    onChange = e => {
      const files = Array.from(e.target.files)
      this.setState({ uploading: true })
  
      const formData = new FormData()
  
      files.forEach((file, i) => {
        formData.append(i, file)
      })
  
      /*fetch(`${API_URL}/image-upload`, {
        method: 'POST',
        body: formData
      })
      .then(res => res.json())
      .then(images => {
        this.setState({ 
          uploading: false,
          images
        })
      })*/
    }
  
    removeImage = id => {
      this.setState({
        images: this.state.images.filter(image => image.public_id !== id)
      })
    }
    
    render() {
      const { uploading, images } = this.state
  
      const content = () => {
        switch(true) {
          case uploading:
            return <Spinner />
          case images.length > 0:
            return <Images images={images} removeImage={this.removeImage} />
          default:
            return <Buttons onChange={this.onChange} />
        }
      }
  
      return (
        <div>
          <div className='buttons'>
            {content()}
          </div>
        </div>
      )
    }
  }