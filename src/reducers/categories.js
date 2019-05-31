import Actions from '../actions/categories.js'

export default (state = {"category": ""}, action) => {
    console.log("action types");
    console.log(action.type);
      switch (action.type) {
        case 'CATEGORIES':
        return {category: action.payload}
      }
      return state;
    };