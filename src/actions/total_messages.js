import Actions from "./actions.js";

export const saveMessageTotalNum = num => ({
  type: Actions.SAVE_MESSAGE_TOTAL_NUM,
  payload: num
});
