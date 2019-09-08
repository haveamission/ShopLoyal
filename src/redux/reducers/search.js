import Actions from '../actions/actions';

export default (state = "", action) => {
  switch (action.type) {
    case Actions.SEARCH:
      return { search: action.payload }
    default:
      return state;
  }
  //return state;
};