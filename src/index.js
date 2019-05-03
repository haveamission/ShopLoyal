import React, { Component } from 'react'
import { combineReducers } from 'redux'
import { render } from 'react-dom'
import { ConnectedRouter } from 'connected-react-router'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
//import 'bootstrap/dist/css/bootstrap.css';
import './bootstrap2-toggle.min.css';
import './index.css';
import './styles/main.css';
import registerServiceWorker from './registerServiceWorker';
//import appsFlyer from 'cordova-plugin-appsflyer-sdk';

import Toggle from 'react-bootstrap-toggle';

import { 
  CSSTransition, 
  TransitionGroup 
} from 'react-transition-group';



import createHistory from 'history/createBrowserHistory'
//import App from './App';
import Layout from './components/Layout'
import routes from './routes';
import configureStore, { history } from './store'
import Login from './containers/Login';
import Map from './components/Map';
import Cards from './components/Cards';
import CardRow from './components/CardRow';
import PrivateRoute from './containers/PrivateRoute';
import Chat from './components/Chat';
import Detail from './components/Detail';


// Not ideal - figure out why node_modules isn't working

const store = configureStore(history)



const startApp = () => {
    
// Initialize

appsflyerInit();
    
render((
    <Provider store={store}>
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
        {/*<Route exact path="/login/" component={Login} />
        <PrivateRoute path="/" component={App}/>*/}
        <Route exact path="/" component={Cards} />
        <Route exact path="/map/" component={Map} />
        <Route exact path="/cards/" component={Cards} />
        <Route exact path="/cardrow/" component={CardRow} />
        <Route exact path="/chat/" component={Chat} />
        <Route exact path="/detail/" component={Detail} />
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

  console.log(window.plugins);
  
  //window.plugins.appsFlyer.initSdk(options, onSuccess, onError);
}

if(!window.cordova) {
  startApp()
} else {
  document.addEventListener('deviceready', startApp, false)
}