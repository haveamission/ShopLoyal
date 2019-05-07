export default levelReducer = (state = 1, action) => {
    switch (action.type) {
      case Actions.LEVEL_UP:
        return state + 1;
      case Actions.LEVEL_DOWN:
          return state - 1;
    }
    return state;
  };