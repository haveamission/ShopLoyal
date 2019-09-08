/* eslint-disable import/first */
import React from "react";
import { render } from "react-dom";
import { ConnectedRouter } from "connected-react-router";
import { Route } from "react-router-dom";
import registerServiceWorker from "./registerServiceWorker";
import { push } from "connected-react-router";
import "@babel/polyfill";
import { AnimatedSwitch } from "react-router-transition";
import initReactFastclick from "react-fastclick";

initReactFastclick();

// Import Components
import Layout from "./components/Layout";
import configureStore, { history } from "./store";
import Map from "./components/Map";
import Cards from "./components/Cards";
import CardRow from "./components/CardRow";
import PrivateRoute from "./routing/PrivateRoute";
import Chat from "./components/Chat";
import Detail from "./components/Detail";
import Loading from "./components/Loading";
import LoginPage from "./components/LoginPage";
import Settings from "./components/Settings";
import Support from "./components/Support";
import Privacy from "./components/Privacy";
import Error from "./components/Error";
import FavMerchants from "./components/FavMerchants";
import Terms from "./components/Terms";
import Contact from "./components/Contact";
import BackgroundProcess from "./components/BackgroundProcess";

// Import Styles
import "./resources/styles/main.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import Config

// Redux
import { Provider, ReactReduxContext } from "react-redux";
import { PersistGate } from "redux-persist/es/integration/react";

// Keycloak
import Keycloak from "keycloak-js";
import { KeycloakProvider } from "react-keycloak";
import keycloak_config from "./keycloak.json";
const { store, persistor } = configureStore(history);
const keycloak = new Keycloak(keycloak_config);

// Redux Actions
import { addTokens } from "./actions/tokens";
import getLocation from "./actions/location";
import { engagementSave, openedFromPushSave } from "./actions/analytics";

const startApp = () => {
  // Initialize

  if (window.plugins) {
    appsflyerInit();
    oneSignal();
  }

  var tokens = store.getState().tokens;

  render(
    <KeycloakProvider
      keycloak={keycloak}
      onEvent={(event, error) => { }}
      onTokens={tokens => {
        store.dispatch(addTokens(tokens));
        store.dispatch(push("/"));
        //history.pushState(null, '/');
      }}
      initConfig={{
        onLoad: "check-sso",
        flow: "hybrid",
        ...tokens,
        // Has to be set for automatic SSO to work, however a high interval needs to be set due to bug in KC library
        checkLoginIframe: true,
        checkLoginIframeInterval: 86400
      }}
      onAuthSuccess={event => { }}
    >
      <Provider store={store} context={ReactReduxContext}>
        <PersistGate loading={<Loading />} persistor={persistor}>
          <ConnectedRouter history={history} context={ReactReduxContext}>
            <Layout>
              <Route
                onUpdate={() => window.scrollTo(0, 0)}
                render={({ location }) => {
                  const { pathname } = location;
                  return (
                    <Route
                      onUpdate={() => window.scrollTo(0, 0)}
                      location={location}
                      render={() => (
                        <AnimatedSwitch
                          atEnter={{ opacity: 0 }}
                          atLeave={{ opacity: 0 }}
                          atActive={{ opacity: 1 }}
                          className="switch-wrapper"
                        >
                          <Route exact path="/login" component={LoginPage} />
                          <Route path="/error/" component={Error} />
                          <PrivateRoute
                            exact
                            path="/settings"
                            component={Settings}
                          />
                          <PrivateRoute exact path="/" component={Cards} />
                          <PrivateRoute exact path="/map/" component={Map} />
                          <PrivateRoute
                            exact
                            path="/cards/"
                            component={Cards}
                          />
                          <PrivateRoute
                            exact
                            path="/cardrow/"
                            component={CardRow}
                          />
                          <PrivateRoute path="/chat/" component={Chat} />
                          <PrivateRoute path="/detail/" component={Detail} />
                          <PrivateRoute path="/support/" component={Support} />
                          <PrivateRoute path="/privacy/" component={Privacy} />
                          <PrivateRoute path="/contact/" component={Contact} />
                          <PrivateRoute path="/terms/" component={Terms} />
                          <PrivateRoute
                            path="/favmerchants/"
                            component={FavMerchants}
                          />
                        </AnimatedSwitch>
                      )}
                    />
                  );
                }}
              />
              <ToastContainer />
            </Layout>
          </ConnectedRouter>
        </PersistGate>
      </Provider>
    </KeycloakProvider>,

    document.getElementById("root")
  );
  registerServiceWorker();
};

function appsflyerInit() {
  var options = {
    devKey: "5TgbTvDgXuQkN5sdxBEGa8", // your AppsFlyer devKey
    isDebug: true,
    appId: "1458126556"
  };

  var userAgent = window.navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(userAgent)) {
    options.appId = "1458126556"; // your ios app id in app store
  }

  var onSuccess = function (result) {
    //console.log(result);
  };

  function onError(err) {
    console.log(err);
  }

  window.plugins.appsFlyer.initSdk(options, onSuccess, onError);
}

function oneSignal() {
  // Enable to debug issues.
  //window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});

  var notificationOpenedCallback = function (jsonData) {
    window.plugins.appsFlyer.trackEvent("af_opened_from_push_notification", {});
    console.log("notificationOpenedCallback: " + JSON.stringify(jsonData));
  };

  window.plugins.OneSignal.startInit("2f19cafc-d4ab-4b01-aecd-dd7961b3b8e3")
    .handleNotificationOpened(notificationOpenedCallback)
    .inFocusDisplaying("None")
    .handleNotificationReceived(function (jsonData) {
      window.cordova.plugins.notification.badge.increase(1, function (badge) { });
    })
    .endInit();
}

if (!window.cordova) {
  startApp();
} else {
  document.addEventListener("deviceready", startApp, false);
}
