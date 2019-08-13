export const Actions = {
  SAVE_MESSAGE_TOTAL_NUM: "SAVE_MESSAGE_TOTAL_NUM"
};

export const saveMessageTotalNum = num => ({
  type: Actions.SAVE_MESSAGE_TOTAL_NUM,
  payload: num
});
