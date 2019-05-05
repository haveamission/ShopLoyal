import configureStore, { history } from './store'

const store = configureStore(history);

//
//  Actions
//
const Actions = {
    LEVEL_UP: 'LEVEL_UP',
    LEVEL_DOWN: 'LEVEL_DOWN',
  };
  //
  //  Action Creators
  //
  const levelUp = () => ({
    type: Actions.LEVEL_UP
  });
  
  const levelDown = () => ({
    type: Actions.LEVEL_DOWN
  });
  //
  //  Reducers
  //
  const levelReducer = (state = 1, action) => {
    switch (action.type) {
      case Actions.LEVEL_UP:
        return state + 1;
      case Actions.LEVEL_DOWN:
          return state - 1;
    }
    return state;
  };
  //
  //  Bootstrapping
  //
  const store = createStore(levelReducer);
  //
  //  Run!
  //
  console.log(store.getState());
  store.dispatch(levelUp());
  store.dispatch(levelUp());
  store.dispatch(levelUp());
  console.log(store.getState());
  store.dispatch(levelDown());
  console.log(store.getState());