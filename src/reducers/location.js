import Actions from '../actions/location.js'

const INIT_STATE = {
    coords: {
      latitude: 42.5467,
      longitude: -83.2113
    }
  }
  
 export default (state = INIT_STATE, action) => {
    switch(action.type) {
    case 'GET_LOCATION':
      return action.payload;
    default:
      return state
    }
  }