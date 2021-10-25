import axios from "../../api/axios";
import { userConstants } from "./constant";

export const signup = (user) => {
  //check this part
  return async (dispatch) => {
    dispatch({ type: userConstants.USER_REGISTER_REQUEST });

    const res = await axios.post("/v1/projects/{projectId}/users", {
      ...user,
    });

    if (res.status === 201) {
      const { message } = res;
      dispatch({
        type: userConstants.USER_REGISTER_SUCCESS,
        payload: message
      });
    } else {
      if (res.status === 400) {
        const { message } = res;
        dispatch({
          type: userConstants.USER_REGISTER_FAILURE,
          payload: { error: message },
        });
      }
    }
  };
};
