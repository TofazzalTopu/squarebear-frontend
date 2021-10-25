import { websocketConstant } from "../actions/constant";

const initState = {
  client: null,
  visible: false
};

const socketReducer = (state = initState, action) => {

  switch (action.type) {
    case websocketConstant.ONCONNECT:
      return {
        ...state,
        visible: true,
      };
    case websocketConstant.REF_CONNECT:
      return {
        ...state,
        visible: true,
        client: action.payload
      };
    case websocketConstant.DISCONNECT:
      return {
        ...state,
        visible: false,
      };

    case websocketConstant.SENDMESSAGE:
      return {
        ...state,
        visible: true,
        client: action.payload
      };

    default:
      return state;
  }
};
export default socketReducer;
