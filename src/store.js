import { apiMiddleware } from "redux-api-middleware";
import { persistReducer, persistStore } from "redux-persist";
import { routerMiddleware } from "connected-react-router";
import createRootReducer from "./reducers/index";
import { createHashHistory } from "history";
import localForage from "localforage";
import { createStore, applyMiddleware, compose } from "redux";
import getLocation from "./actions/location";
import { engagementSave } from "./actions/analytics";

export const history = createHashHistory();

const persistConfig = {
  key: "root",
  storage: localForage
};

const loggerMiddleware = store => next => action => {
  //console.log("Action type:", action.type);
  //console.log("Action payload:", action.payload);
  //console.log("State before:", store.getState());
  next(action);
  console.log("State after:", store.getState());
};

function promiseMiddleware({ dispatch }) {
  function isPromise(val) {
    return val && typeof val.then === "function";
  }

  return next => action => {
    return isPromise(action.payload)
      ? action.payload.then(
        result => dispatch({ ...action, payload: result }),
        error => dispatch({ ...action, payload: error, error: true })
      )
      : next(action);
  };
}

const persistedReducer = persistReducer(
  persistConfig,
  createRootReducer(history)
);

function configureStore(preloadedState) {
  const store = createStore(
    persistedReducer,
    preloadedState,
    compose(
      applyMiddleware(
        loggerMiddleware,
        routerMiddleware(history),
        apiMiddleware,
        promiseMiddleware
      )
    )
  );

  return store;
}

export default history => {
  let store = configureStore(history);
  let persistor = persistStore(store, {}, () => {
    var engagement = store.getState().analytics.engagement + 1;
    store.dispatch(engagementSave(engagement));
    if (window.Cordova) {
      store.dispatch(getLocation());
    }
    if (engagement === 2 || engagement === 4) {
      trackEngagement();
    }
  });
  store.subscribe(() => {
    //console.log('state data\n', store.getState());
  });

  return { store, persistor };
};

function trackEngagement() {
  if (window.plugins) {
    window.plugins.appsFlyer.trackEvent("af_re_engage", {});
  }
}
