
import {Actions} from '../actions/color';


export default (state = {}, action) => {
    switch (action.type){
      case Actions.SAVE_COLOR:
      var merchantId = action.payload.id;
      return Object.assign({}, state, {[merchantId]: action.payload.color});
      default:
      return state;
    }
  };