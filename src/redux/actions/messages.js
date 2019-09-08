import Actions from "./actions.js";

export const saveMessageNum = num => ({
  type: Actions.SAVE_MESSAGE_NUM,
  payload: num
});
