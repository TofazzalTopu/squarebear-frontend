import axios from "../../api/axios";
import { authConstants } from "./constant";

export const login = (user) => {

  //check this part
  return async (dispatch) => {
    dispatch({ type: authConstants.LOGIN_REQUEST });
    try {
      const res = await axios.post("/v1/users/login", {
        ...user,
      });

      if (res.status === 200) {
        const { token, user } = res.data;
        localStorage.setItem("sqtoken", JSON.stringify(token));
        localStorage.setItem("squser", JSON.stringify(user));
        dispatch({
          type: authConstants.LOGIN_SUCCESS,
          payload: {
            token,
            user,
          },
        });
      }
    } catch (error) {
      dispatch({
        type: authConstants.LOGIN_FAILURE,
        payload: { error: "INVALID CREDENTIALS" },
      });
    }

  };
};

export const isUserLoggedIn = () => {
  return async (dispatch) => {
    const token = window.localStorage.getItem("sqtoken");

    if (token) {
      const user = JSON.parse(window.localStorage.getItem("squser"));
      dispatch({
        type: authConstants.LOGIN_SUCCESS,
        payload: {
          token,
          user,
        },
      });
    } else {
      dispatch({
        type: authConstants.LOGIN_FAILURE,
        // payload: { error: "Need to login" },
      });
    }
  };
};

export const signout = () => {
  return async (dispatch) => {
    window.localStorage.removeItem("sqtoken");
    window.localStorage.removeItem("squser");
    dispatch({
      type: authConstants.LOGOUT_SUCCESS,
      payload: "Success"
    });
  };
};

// export const signout = () => {
//   return async (dispatch) => {
//     dispatch({
//       type: authConstants.LOGOUT_REQUEST,
//     });

//     try {
//       const res = await axios.get("/v1/users/logout");
//       if (res.status === 200) {
//         window.localStorage.removeItem("sqtoken");
//         window.localStorage.removeItem("squser");
//         dispatch({
//           type: authConstants.LOGOUT_SUCCESS,
//           payload: res.data
//         });
//       } else {
//         dispatch({
//           type: authConstants.LOGOUT_FAILURE,
//           payload: { error: res.data.error },
//         });
//       }
//     } catch (error) {
//       console.log("signout error", error);
//     }

//   };
// };

