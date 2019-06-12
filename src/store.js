import storage from 'redux-persist/es/storage'
import { apiMiddleware } from 'redux-api-middleware';
import { createFilter   } from 'redux-persist-transform-filter';
import { persistReducer, persistStore } from 'redux-persist'
import { routerMiddleware } from 'connected-react-router'
import rootReducer from './reducers/index'
import createRootReducer from './reducers/index'
import { createBrowserHistory } from 'history'
import {createHashHistory} from 'history'
import reducers from './reducers/index'
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import createOidcMiddleware from "redux-oidc";
import userManager from './config/OIDC';

//export const history = createBrowserHistory()

export const history = createHashHistory()

history.listen( location =>  {
  window.NativeKeyboard.hideMessenger({
    animated: true // default false
  });
 });


const persistConfig = {
  key: 'root',
  storage,
}

const oidcMiddleware = createOidcMiddleware(userManager);

const loggerMiddleware = store => next => action => {
  console.log("Action type:", action.type);
  console.log("Action payload:", action.payload);
  console.log("State before:", store.getState());
  next(action);
  console.log("State after:", store.getState());
};

function promiseMiddleware({dispatch}) {
  function isPromise(val) {
    return val && typeof val.then === 'function';
  }

  return next => action => {
    return isPromise(action.payload)
      ? action.payload.then(
          result => dispatch({...action, payload: result}),
          error => dispatch({...action, payload: error, error: true })
        )
      : next(action);
  };
}

const persistedReducer = persistReducer(persistConfig, createRootReducer(history))

function configureStore(preloadedState) {
  const store = createStore(
    persistedReducer,
    preloadedState,
    compose(
      applyMiddleware(
        //oidcMiddleware,
        loggerMiddleware,
        routerMiddleware(history),
        apiMiddleware,
        promiseMiddleware,
      ),
    ),
  )

  return store
}

export default (history) => {
  let store = configureStore(history);
  /*loadUser(store, userManager)
  .then((user) => {
    console.log('USER_FOUND', user);
    if (user) {
      store.dispatch({
        type: 'redux-oidc/USER_FOUND',
        payload: user,
      });
    }
  }).catch((err) => {
    console.log(err);
  });*/
  let persistor = persistStore(store)
  store.subscribe( () => {
    //console.log('state data\n', store.getState());
    //debugger;
  });

  return { store, persistor }
}