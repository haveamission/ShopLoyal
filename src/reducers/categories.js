import Actions from '../actions/actions';

export default (state = { "category": "" }, action) => {
  switch (action.type) {
    case Actions.CATEGORIES:
      return { category: action.payload }
  }
  return state;
};