import axios from "../../api/axios";
import { ProfileConstants } from "./constant";

export const getOrganizationProfile = (id) => {

    return async (dispatch) => {
        dispatch({ type: ProfileConstants.ORGANIZATION_PROFILE_REQUEST });
        try {
            const res = await axios.get("/v1/projects/" + id + "/users");
            console.log("=========================", res.data.data);
            dispatch({
                type: ProfileConstants.ORGANIZATION_PROFILE_SUCCESS,
                payload: res.data.data
            });

        } catch (error) {
            dispatch({
                type: ProfileConstants.ORGANIZATION_PROFILE_FAILURE,
                payload: error.message
            });
        }
    };
};
export const avatarChange = (projectId, id, avatar) => {
    return async (dispatch) => {
        try {
            const res = await axios.put(`/v1/projects/{projectId}/users/${id}/avatar?avatar=${avatar}`);
            dispatch(getOrganizationProfile(projectId))
            window.localStorage.removeItem("squser");
            window.localStorage.setItem("squser", JSON.stringify(res.data.data));
            const users = JSON.parse(window.localStorage.getItem("squser"))
            dispatch({
                type: ProfileConstants.PROFILE_AVATAR_REQUEST,
                payload: users
            })

        } catch (error) {
            console.log(error);
        }

    };
};
