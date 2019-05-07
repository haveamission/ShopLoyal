//
//  Actions
//
const Actions = {
    LEVEL_UP: 'LEVEL_UP',
    LEVEL_DOWN: 'LEVEL_DOWN',
  };
  //
  //  Action Creators
  //
  const levelUp = () => ({
    type: Actions.LEVEL_UP
  });
  
  const levelDown = () => ({
    type: Actions.LEVEL_DOWN
  });