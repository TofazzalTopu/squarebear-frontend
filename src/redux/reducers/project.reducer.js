import { ProjectConstants } from "../actions/constant";

const initState = {
    project: {},
    loading: false,
    message: "",
};

const projectReducer = (state = initState, action) => {
    switch (action.type) {
        case ProjectConstants.PROJECT_CREATE_REQUEST:
            return {
                ...state,
                loading: true,
                message: ''
            };
        case ProjectConstants.PROJECT_CREATE_SUCCESS:
            return {
                ...state,
                loading: false,
                project: action.payload.data,
                message: action.payload.message,
            };
        case ProjectConstants.ALL_PROJECTS_GET:
            return {
                ...state,
                loading: false,
                project: action.payload,
                message: action.payload.message,
            };
        case ProjectConstants.PROJECT_CREATE_FAILURE:
            return {
                ...state,
                message: "Server Error"
            };
        default:
            return state;
    }
};
export default projectReducer;
