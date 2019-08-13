import Actions from "../actions/messages.js";

export default (state = [], action) => {
  switch (action.type) {
    case "SAVE_MESSAGE_NUM":
      return action.payload;
  }
  return state;
};
