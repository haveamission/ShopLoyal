import Actions from "./actions.js";

export default (text) => ({
  type: Actions.SEARCH,
  payload: text
});