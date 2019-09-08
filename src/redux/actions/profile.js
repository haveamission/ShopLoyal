import Actions from "./actions.js";

export const profileSave = (profileData) => ({
  type: Actions.PROFILESAVE,
  payload: profileData
});

export const profileDelete = (profileData) => ({
  type: Actions.PROFILEDELETE,
});

export const keycloakSave = (profileData) => ({
  type: Actions.KEYCLOAKSAVE,
  payload: profileData
});

export const keycloakDelete = (profileData) => ({
  type: Actions.KEYCLOAKDELETE,
});