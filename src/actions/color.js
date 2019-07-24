export const Actions = {
    SAVE_COLOR: 'SAVE_COLOR',
  };

  export const colorSave = (color) => ({
    type: Actions.SAVE_COLOR,
    payload: color
  });