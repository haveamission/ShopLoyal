import Actions from '../actions/actions';

export default (state = true, action) => {
  switch (action.type) {
    case Actions.FLAG_ONESIGNAL:
      return action.payload;
    default:
      return state;
  }
};
