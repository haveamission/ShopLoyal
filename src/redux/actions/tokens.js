import Actions from "./actions.js";

export const addTokens = (tokens) => ({
    type: Actions.ADD_TOKENS,
    payload: tokens
})