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

import Toggle from 'react-bootstrap-toggle';



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

//import registerServiceWorker from './registerServiceWorker';

const store = configureStore(history)



//const startApp = () => {
    
// Initialize
    
render((
    <Layout>
    <Provider store={store}>
    <ConnectedRouter history={history}>
      <Switch>
        {/*<Route exact path="/login/" component={Login} />
        <PrivateRoute path="/" component={App}/>*/}
        <Route exact path="/map/" component={Map} />
        <Route exact path="/cards/" component={Cards} />
        <Route exact path="/cardrow/" component={CardRow} />
        <Route exact path="/chat/" component={Chat} />
        <Route exact path="/detail/" component={Detail} />
      </Switch>
    </ConnectedRouter>
  </Provider>
  </Layout>
), document.getElementById('root'));
//registerServiceWorker();
//}

/*if(!window.cordova) {
  startApp()
} else {
  document.addEventListener('deviceready', startApp, false)
}*/