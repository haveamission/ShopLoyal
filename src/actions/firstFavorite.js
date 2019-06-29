const Actions = {
    FIRSTFAVORITE: 'FIRSTFAVORITE',
  };
  //
  //  Action Creators
  //

  export const firstFavoriteSave = (firstFavorite) => ({
    type: Actions.FIRSTFAVORITE,
    payload: firstFavorite
  });
