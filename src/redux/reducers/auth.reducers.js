import { authConstants } from "../actions/constant";

const initState = {
  token: null,
  user: {
    firstName: "",
    lastName: "",
    email: "",
    picture: "",
  },
  authenticate: false,
  authenticating: false,
  loading: false,
  error: "",
  message: "",
};

const authReducer = (state = initState, action) => {
  switch (action.type) {
    case authConstants.LOGIN_REQUEST:
      return {
        ...state,
        authenticating: true,
      };

    case authConstants.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        authenticate: true,
        authenticating: false,
        error: "",
        message: "Login success"
      };
    case authConstants.LOGIN_FAILURE:
      return {
        state: {
          ...state,
          error: action?.payload?.error
        },
      };

    case authConstants.LOGOUT_REQUEST:
      return {
        state: {
          ...state,
          loading: true,
        },
      };
    case authConstants.LOGOUT_SUCCESS:
      return {
        state: {
          ...state,
          user: {},
          token: null,
          authenticate: false,
          authenticating: false,
          message: action.payload
        },
      };

    case authConstants.LOGOUT_FAILURE:
      return {
        state: {
          ...state,
          error: action.payload.error,
          loading: false,
        },
      };
    default:
      return state;
  }
};
export default authReducer;
