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

export default function configureStore(preloadedState) {
  const store = createStore(
    createRootReducer(history),
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