//
//  Actions
//
const Actions = {
    SEARCH: 'SEARCH',
  };
  //
  //  Action Creators
  //

  export default (text) => ({
    type: Actions.SEARCH,
    payload: text
  });
