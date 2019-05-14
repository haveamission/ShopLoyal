import React from 'react'
import { Link } from 'react-router-dom'
import Iframe from 'react-iframe'
import Page from './Page'

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
<li className="list-top">Picture</li>
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