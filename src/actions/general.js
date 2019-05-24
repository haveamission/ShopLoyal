//
//  Actions
//
const Actions = {
    LEVEL_UP: 'LEVEL_UP',
    LEVEL_DOWN: 'LEVEL_DOWN',
    SAVE_COLOR: 'SAVE_COLOR',
    AUTHOR: 'AUTHOR'
  };
  //
  //  Action Creators
  //
  export const levelUp = () => ({
    type: Actions.LEVEL_UP
  });
  
  export const levelDown = () => ({
    type: Actions.LEVEL_DOWN
  });

  export const author = (bearer) => ({
    type: Actions.AUTHOR,
    payload: bearer
  });

  export default (color) => ({
    type: Actions.SAVE_COLOR,
    payload: color
  });

 