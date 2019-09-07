import Actions from '../actions/actions';

const initialState = {
    tokens: {},
};

function tokens(state = initialState, action) {
    switch (action.type) {
        case Actions.ADD_TOKENS:
            return Object.assign({}, state, action.tokens);
        default:
            return state;
    }
}

export default tokens;