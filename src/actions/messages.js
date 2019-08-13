export const Actions = {
  SAVE_MESSAGE_NUM: "SAVE_MESSAGE_NUM"
};

export const saveMessageNum = num => ({
  type: Actions.SAVE_MESSAGE_NUM,
  payload: num
});
