import Actions from "./actions.js";

export const oneSignalSave = oneSignalState => ({
  type: Actions.FLAG_ONESIGNAL,
  payload: oneSignalState
});
