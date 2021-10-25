import { userConstants } from "../actions/constant";

const initState = {
  error: null,
  message: "",
  loading: false,

};

const userReducer = (state = initState, action) => {
  // console.log(action);
  switch (action.type) {
    case userConstants.USER_REGISTER_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case userConstants.USER_REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload,

      };

    case userConstants.USER_REGISTER_FAILURE:
      return {
        state: {
          ...state,
          loading: false,
          error: action.payload.error,
        },
      };
    default:
      return state;
  }
};
export default userReducer;
