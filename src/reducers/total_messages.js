import Actions from "../actions/total_messages.js";

export default (state = 0, action) => {
  switch (action.type) {
    case "SAVE_MESSAGE_TOTAL_NUM":
      return action.payload;
  }
  return state;
};
