import Actions from "./actions.js";

export const colorSave = (color) => ({
  type: Actions.SAVE_COLOR,
  payload: color
});