import React, { Component } from 'react'
import { render } from 'react-dom'
import { ConnectedRouter } from 'connected-react-router'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker';
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

// Redux
//import { combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/es/integration/react'
//import createHistory from 'history/createBrowserHistory'
const {store, persistor} = configureStore(history)

const startApp = () => {
    
// Initialize

appsflyerInit();
    
render((
    <Provider store={store}>
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
        {/*<Route exact path="/login/" component={Login} />
        <PrivateRoute path="/" component={App}/>*/}
        <Route exact path="/" component={Cards} />
        <Route exact path="/map/" component={Map} />
        <Route exact path="/cards/" component={Cards} />
        <Route exact path="/cardrow/" component={CardRow} />
        <Route exact path="/chat/" component={Chat} />
        <Route path="/detail/" component={Detail} />
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