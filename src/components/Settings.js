import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import Iframe from 'react-iframe'
import Page from './Page'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBowlingBall } from '@fortawesome/free-solid-svg-icons'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { faImages, faImage } from '@fortawesome/free-solid-svg-icons'
import Loading from './Loading'
import userManager from '../config/OIDC';
import { connect } from "react-redux";
import API from './API'
import LogoutSettings from './LogoutSettings'
import axios from 'axios';
import { push } from 'connected-react-router'
import MainSettings from './MainSettings'
import { withKeycloak } from 'react-keycloak';
import Back from './Back';


class Settings extends Component {

  state = {
    profile: {},
  }

  configuration(data) {
this.setState({profile: data});
  }

  getSettings() {
    let config = {
      headers: {
        Authorization: "Bearer " + this.props.keycloak.idToken,
      }
    }

    axios.get(API.prodBaseUrlString + API.settings, config).then(
      response => this.loadSettings(response.data)
      ).catch(function(error) {
      console.log(error);
      })
  }

  loadSettings(data) {
console.log(data);
this.setState(data);
  }


  componentDidMount() {

    if(this.props.keycloak.authenticated) {

let config = {
  headers: {
    Authorization: "Bearer " + this.props.keycloak.idToken,
  }
}
    

axios.get(API.prodBaseUrlString + API.userProfileAPI, config).then(
  response => this.configuration(response.data)
);

this.getSettings();

  }
  else {
   // this.props.dispatch(push("/login"));
  }
}

  render() {
    console.log("state here");
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
          <Back />
  <div className="settings">
      <ProfileSettings profile={this.state.profile}/>
      <MainSettings data={this.state} />
      <LogoutSettings />
  </div>
  </Page>
)
  }
}

export default withKeycloak(Settings);

class ProfileSettings extends React.Component {

  render() {

    console.log(this.props);
    return (
<div>
<h3 className="profile-name">{this.props.profile.name}</h3>
<div className="profile-email">{this.props.profile.email}</div>
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
            return <Loading />
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