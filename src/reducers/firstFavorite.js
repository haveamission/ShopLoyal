import Actions from '../actions/actions';

export default (state = null, action) => {
  switch (action.type) {
    case Actions.FIRSTFAVORITE:
      return action.payload
  }
  return state;
};