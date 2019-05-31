import React, { Component } from 'react'
import { render } from 'react-dom'
import { ConnectedRouter } from 'connected-react-router'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker';
import "@babel/polyfill";
//import appsFlyer from 'cordova-plugin-appsflyer-sdk';

// Import Components
//import App from './App';
import Layout from './components/Layout'
import configureStore, { history } from './store'
import Login from './containers/Login';
import Map from './components/Map';
import Cards from './components/Cards';
import CardRow from './components/CardRow';
import PrivateRoute from './containers/PrivateRoute';
import Chat from './components/Chat';
import Detail from './components/Detail';
import Loading from './components/Loading';
import LoginPage from './components/LoginPage';
import Settings from './components/Settings';
import Callback from './components/Callback';
import Support from './components/Support';
import Privacy from './components/Privacy';
import Error from './components/Error';
import FavMerchants from './components/FavMerchants';

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

import { OidcProvider } from 'redux-oidc';
import userManager from './config/OIDC';

// Redux
//import { combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/es/integration/react'
//import createHistory from 'history/createBrowserHistory'
const {store, persistor} = configureStore(history)

console.log(userManager);



//userManager.signinRedirect();

const startApp = () => {
    
// Initialize

appsflyerInit();
//oneSignal();
    
render((
    <Provider store={store}>
    <OidcProvider store={store} userManager={userManager}>
    <PersistGate loading={<Loading />} persistor={persistor}>
    <ConnectedRouter history={history}>
    <Layout>
    <Route
          render={({ location }) => {
            const { pathname } = location;
            return (
              <TransitionGroup>
                <CSSTransition 
                  key={pathname}
                  classNames="page"
                  timeout={{
                    enter: 1000,
                    exit: 1000,
                  }}
                >
    <Route
                    location={location}
                    render={() => (
      <Switch>
        <Route exact path="/login" component={LoginPage} />
        <Route path="/callback/" component={Callback} />
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
      </Switch>
    )}
    />
                    </CSSTransition>
              </TransitionGroup>
            );
          }}
          />
      </Layout>
    </ConnectedRouter>
    </PersistGate>
    </OidcProvider>
  </Provider>
 
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