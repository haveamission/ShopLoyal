import Actions from '../actions/firstFavorite.js'

export default (state = null, action) => {
      switch (action.type) {
        case 'FIRSTFAVORITE':
        return action.payload
      }
      return state;
    };