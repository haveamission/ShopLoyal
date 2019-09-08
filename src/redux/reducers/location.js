import Actions from '../actions/actions';

const INIT_STATE = {
  coords: {
    latitude: 42.5467,
    longitude: -83.2113
  }
}

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case Actions.GET_LOCATION:
      return action.payload;
    default:
      return state
  }
}