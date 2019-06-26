import Actions from '../actions/idprovider.js'

export default (state = null, action) => {
      switch (action.type) {
        case 'IDPROVIDER':
        return action.payload
      }
      return state;
    };