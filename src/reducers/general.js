import Actions from '../actions/general.js'

/*export default (state = 1, action) => {
  //console.log(state);
    switch (action.type) {
      case 'LEVEL_UP':
      //console.log(action.type);
        return state + 1;
      case 'LEVEL_DOWN':
          return state - 1;
      case 'SAVE_COLOR':
      return {color: action.payload}
    }
    //console.log("final state");
    //console.log(state);
    return state;
  };*/

 export const author = (state = 1, action) => {
    //console.log(state);
      switch (action.type) {
        case 'AUTHOR':
        return {author: action.payload}
      }
      //console.log("final state");
      //console.log(state);
      return state;
    };

  export default (state = 1, action) => {
    //console.log(state);
      switch (action.type) {
        case 'SAVE_COLOR':
        return {color: action.payload}
        case 'AUTHOR':
        return {author: action.payload}
      }

      //console.log("final state");
      //console.log(state);
      return state;
    };

  //export {color};