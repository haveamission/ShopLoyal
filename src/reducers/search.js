import Actions from '../actions/search.js'

export default (state = "", action) => {
      switch (action.type) {
        case 'SEARCH':
        return {search: action.payload}
      }
      return state;
    };