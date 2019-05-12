import storage from 'redux-persist/es/storage'
import { apiMiddleware } from 'redux-api-middleware';
import { createFilter   } from 'redux-persist-transform-filter';
import { persistReducer, persistStore } from 'redux-persist'
import { routerMiddleware } from 'connected-react-router'
import rootReducer from './reducers'
import createRootReducer from './reducers'
import { createBrowserHistory } from 'history'
import reducers from './reducers';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';

export const history = createBrowserHistory()

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, createRootReducer(history))

function configureStore(preloadedState) {
  const store = createStore(
    persistedReducer,
    preloadedState,
    compose(
      applyMiddleware(
        routerMiddleware(history),
        apiMiddleware
      ),
    ),
  )

  return store
}

export default (history) => {
  let store = configureStore(history);
  let persistor = persistStore(store)
  return { store, persistor }
}