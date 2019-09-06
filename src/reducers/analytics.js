import Actions from '../actions/actions';

export default (state = { engagement: 0, opened_from_push: false }, action) => {
  switch (action.type) {
    case Actions.SAVE_ENGAGEMENT:
      return {
        ...state,
        engagement: action.payload,
      };
    case Actions.SAVE_OPENED_FROM_PUSH:
      return {
        ...state,
        opened_from_push: action.payload,
      };
    default:
      return state;
  }
};