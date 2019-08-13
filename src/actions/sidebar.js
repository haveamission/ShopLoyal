export const Actions = {
  OPEN_SIDEBAR: 'OPEN_SIDEBAR',
};

export const openSideBar = (sideBarState) => ({
  type: Actions.OPEN_SIDEBAR,
  payload: sideBarState
});