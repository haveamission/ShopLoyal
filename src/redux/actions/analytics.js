import Actions from "./actions.js";

export const engagementSave = (engagement) => ({
  type: Actions.SAVE_ENGAGEMENT,
  payload: engagement
});
export const openedFromPushSave = (opened_from_push) => ({
  type: Actions.SAVE_OPENED_FROM_PUSH,
  payload: opened_from_push
});