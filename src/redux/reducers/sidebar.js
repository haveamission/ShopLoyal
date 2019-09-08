import Actions from '../actions/actions';

export default (state = false, action) => {
  switch (action.type) {
    case Actions.OPEN_SIDEBAR:
      return action.payload;
    default:
      return state;
  }
};