import Actions from '../actions/location.js'

const INIT_STATE = {
    coords: {
      latitude: 0,
      longitude: 0
    }
  }
  
 export default (state = INIT_STATE, action) => {
      console.log("location actions");
      console.log(action);
    switch(action.type) {
    case 'GET_LOCATION':
      return action.payload;
    default:
      return state
    }
  }