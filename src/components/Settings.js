import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import Iframe from 'react-iframe'
import Page from './Page'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBowlingBall } from '@fortawesome/free-solid-svg-icons'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { faImages, faImage } from '@fortawesome/free-solid-svg-icons'
import { ClipLoader } from 'react-spinners';

const Settings  = () => {
    return (
        <Page>
  <div className="settings">
      <ProfileSettings />
      <MainSettings />
      <LogoutSettings />
  </div>
  </Page>
)
}

export default Settings;

const ProfileSettings = () => (
    <ul className="profile-settings">
<li className="list-top">Picture<UploadImage /></li>
<li className="list-top">Name</li>
<li className="list-top">Email</li>
    </ul>
  )

  const MainSettings = () => (
    <ul className="main-settings">
<Link to="/support/"><li>Support</li></Link>
<Link to="/terms/"><li>Terms of Use</li></Link>
<Link to="/privacy/"><li className="list-bottom">Privacy Policy</li></Link>
    </ul>
  )

  const LogoutSettings = () => (
    <ul className="logout-settings">
<li className="list-bottom">Logout</li>
    </ul>
  )

export const Support  = () => (
         <WebPage url="https://www.shoployal.com/support" />
        );

        export const Terms  = () => (
            <WebPage url="https://www.shoployal.com/terms" />
           );

           export const Privacy  = () => (
            <WebPage url="https://www.shoployal.com/privacy" />
           );

const WebPage = (props) => (
    <Iframe url={props.url}
    width="100%"
    height="1000em"
    id="support"
    className="webpage"
    display="initial"
    frameBorder="0"
    overflow="hidden"
    scrolling="no"
    />
);

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