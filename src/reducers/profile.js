import Actions from '../actions/actions';

export default (state = null, action) => {
  switch (action.type) {
    case Actions.PROFILESAVE:
      return action.payload
    case Actions.PROFILEDELETE:
      return action.payload
    case Actions.KEYCLOAKSAVE:
      return action.payload
    case Actions.KEYCLOAKDELETE:
      return action.payload
  }
  return state;
};