import Actions from "./actions.js";

export const openSideBar = (sideBarState) => ({
  type: Actions.OPEN_SIDEBAR,
  payload: sideBarState
});