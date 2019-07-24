import Actions from '../actions/profile.js'

export default (state = null, action) => {
    //console.log("action types");
    //console.log(action.type);
      switch (action.type) {
        case 'PROFILESAVE':
        return action.payload
        case 'PROFILEDELETE':
        return action.payload
        case 'KEYCLOAKSAVE':
        return action.payload
        case 'KEYCLOAKDELETE':
        return action.payload
      }
      return state;
    };