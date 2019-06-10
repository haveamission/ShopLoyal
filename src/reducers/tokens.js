const initialState = {
  tokens: {},
};

function tokens(state = initialState, action) {
  switch (action.type) {
    case 'ADD_TOKENS':
      return Object.assign({}, state, {
        tokens: action.tokens,
      });
    default:
      return state;
  }
}

export default tokens;