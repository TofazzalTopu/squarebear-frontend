import { authConstants, ProjectConstants } from './constant';
import axios from "../../api/axios";
import store from '../store';

export const addNewProject = (project) => {
    return async (dispatch) => {
        dispatch({
            type: ProjectConstants.PROJECT_CREATE_REQUEST,
        })
        try {
            if (project) {
                const res = await axios.post("/v1/projects", project);
                const PrevUser = JSON.parse(window.localStorage.getItem("squser"))
                const token = JSON.parse(window.localStorage.getItem("sqtoken"))
                PrevUser.projectId = res?.data?.data?.id;
                window.localStorage.setItem("squser", JSON.stringify(PrevUser));
                const user = JSON.parse(window.localStorage.getItem("squser"))
                if (user) {
                    store.dispatch({
                        type: authConstants.LOGIN_SUCCESS, payload: {
                            token,
                            user,
                        },
                    });
                }
                dispatch({
                    type: ProjectConstants.PROJECT_CREATE_SUCCESS,
                    payload: res.data
                })
            }
        } catch (error) {
            dispatch({
                type: ProjectConstants.PROJECT_CREATE_FAILURE,
            })
            console.log(error);
        }
    }
}
export const getProjectById = (id) => {
    return async (dispatch) => {
        try {
            if (id) {
                const res = await axios.get("/v1/projects/" + id);
                console.log(res);
                dispatch({
                    type: ProjectConstants.PROJECT_GET,
                    payload: id
                })
            }
        } catch (error) {
            console.log(error);
        }
    }
}
export const getProjectByUserId = (id) => {
    return async (dispatch) => {
        try {
            if (id) {
                const res = await axios.get("/v1/projectUsers/users/" + id);
                console.log(res.data.data[0]);
                dispatch({
                    type: ProjectConstants.ALL_PROJECTS_GET,
                    payload: res.data.data[0]
                })
            }
        } catch (error) {
            console.log("Error occured");
        }
    }
}
//projectUsers/users/{userid}