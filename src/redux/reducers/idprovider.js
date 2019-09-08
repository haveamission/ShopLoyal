import Actions from '../actions/actions';

export default (state = null, action) => {
  switch (action.type) {
    case Actions.IDPROVIDER:
      return action.payload
    default:
      return state;
  }
  //return state;
};