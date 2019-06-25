/* eslint-disable import/first */
import React, { Component } from 'react'
import { render } from 'react-dom'
import { ConnectedRouter } from 'connected-react-router'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker';
import { push } from 'connected-react-router'
import "@babel/polyfill";
import { AnimatedSwitch } from 'react-router-transition';
import initReactFastclick from 'react-fastclick';

initReactFastclick();
//import appsFlyer from 'cordova-plugin-appsflyer-sdk';

// Import Components
//import App from './App';
import Layout from './components/Layout'
import configureStore, { history } from './store'
import Map from './components/Map';
import Cards from './components/Cards';
import CardRow from './components/CardRow';
import PrivateRoute from './containers/PrivateRoute';
//import NewChat from './components/NewChat';
import Chat from './components/Chat';
import Detail from './components/Detail';
import Loading from './components/Loading';
import LoginPage from './components/LoginPage';
import Settings from './components/Settings';
import Support from './components/Support';
import Privacy from './components/Privacy';
import Error from './components/Error';
import FavMerchants from './components/FavMerchants';
import Dummy from './components/Dummy';
import Header from './components/Header';

// Import Styles
import './bootstrap2-toggle.min.css';
import './index.css';
import './styles/main.css';
import Toggle from 'react-bootstrap-toggle';
import {
  CSSTransition,
  TransitionGroup
} from 'react-transition-group';
//import 'bootstrap/dist/css/bootstrap.css';

// Import Config

//import { OidcProvider } from 'redux-oidc';
//import userManager from './config/OIDC';

// Redux
//import { combineReducers } from 'redux'
import { Provider, ReactReduxContext } from 'react-redux'
import { PersistGate } from 'redux-persist/es/integration/react'
//import createHistory from 'history/createBrowserHistory'
// Keycloak
import Keycloak from 'keycloak-js';
import { KeycloakProvider } from 'react-keycloak';
import keycloak_config from './keycloak.json';
import { addTokens } from './actions/tokens';
const {store, persistor} = configureStore(history)

const keycloak = new Keycloak(keycloak_config);


//userManager.signinRedirect();
const startApp = () => {
// Initialize

//window.open = window.cordova.InAppBrowser.open;


//window.cordova.plugins.Keyboard.hideFormAccessoryBar(true);

const onEvent = (event, error) => {
  console.log('onKeycloakEvent', event, error);
  if (typeof error !== undefined) {
    switch (event) {
      case 'onAuthSuccess':
        break;
      case 'onAuthLogout':
        store.dispatch(push("/login"));
        break;
      case 'onTokenExpired':
        break;
      case 'onAuthError':
      default:
        break;
    }
  }
};

appsflyerInit();
//oneSignal();
function myhandler(previousRoute, nextRoute) {
console.log(previousRoute);
console.log(nextRoute);
}

render(
  (
<KeycloakProvider
    keycloak={keycloak}
    onEvent={(event, error) => {
    }}
    onTokens={tokens => {
      store.dispatch(addTokens(tokens));
      store.dispatch(push("/"));
      //history.pushState(null, '/');
    }}
    initConfig={{
      onLoad: 'check-sso',
      flow: 'hybrid'
    }
    }

    >
    <Provider store={store} context={ReactReduxContext}>
    <PersistGate loading={<Loading />} persistor={persistor}>
    <ConnectedRouter history={history} context={ReactReduxContext}>
    <Layout>
    <Route
          render={({ location }) => {
            const { pathname } = location;
            return (
    <Route
                    location={location}
                    render={() => (
                      <AnimatedSwitch
                      atEnter={{ opacity: 1 }}
                      atLeave={{ opacity: 1 }}
                      atActive={{ opacity: 1 }}
                      className="switch-wrapper"
                    >
        <Route exact path="/login" component={LoginPage} />
        <Route path="/error/" component={Error} />
        <PrivateRoute exact path="/settings" component={Settings} />
        <PrivateRoute exact path="/" component={Cards} />
        <PrivateRoute exact path="/map/" component={Map} />
        <PrivateRoute exact path="/cards/" component={Cards} />
        <PrivateRoute exact path="/cardrow/" component={CardRow} />
        <PrivateRoute path="/chat/" component={Chat} />
        <PrivateRoute path="/detail/" component={Detail} />
        <PrivateRoute path="/support/" component={Support} />
        <PrivateRoute path="/privacy/" component={Privacy} />
        <PrivateRoute path="/favmerchants/" component={FavMerchants} />
      </AnimatedSwitch>
    )}
    />
            );
          }}
          />
      </Layout>
    </ConnectedRouter>
    </PersistGate>
  </Provider>
  </KeycloakProvider>

), document.getElementById('root'));
registerServiceWorker();
}

function appsflyerInit() {
  var options = {
    devKey: '5TgbTvDgXuQkN5sdxBEGa8', // your AppsFlyer devKey
    isDebug: true,
  };

  var userAgent = window.navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test( userAgent )) {
    options.appId = '1458126556'; // your ios app id in app store
  }

  var onSuccess = function(result) {
    console.log(result);
  };

  function onError(err) {
    console.log(err);
  }

  //console.log(window.plugins);

  //window.plugins.appsFlyer.initSdk(options, onSuccess, onError);
}

function oneSignal() {
    // Enable to debug issues.
    // window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});

    var notificationOpenedCallback = function(jsonData) {
      console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
    };

    window.plugins.OneSignal
      .startInit("2f19cafc-d4ab-4b01-aecd-dd7961b3b8e3")
      .handleNotificationOpened(notificationOpenedCallback)
      .endInit();

}

if(!window.cordova) {
  startApp()
} else {
  document.addEventListener('deviceready', startApp, false)
}
