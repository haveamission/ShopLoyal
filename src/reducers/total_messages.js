import Actions from '../actions/actions';

export default (state = 0, action) => {
  switch (action.type) {
    case Actions.SAVE_MESSAGE_TOTAL_NUM:
      return action.payload;
  }
  return state;
};
