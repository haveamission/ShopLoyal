import Actions from '../actions/actions';

export default (state = [], action) => {
  switch (action.type) {
    case Actions.SAVE_MESSAGE_NUM:
      return action.payload;
  }
  return state;
};
