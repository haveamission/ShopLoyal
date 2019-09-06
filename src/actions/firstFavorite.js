import Actions from "./actions.js";

export const firstFavoriteSave = (firstFavorite) => ({
  type: Actions.FIRSTFAVORITE,
  payload: firstFavorite
});
