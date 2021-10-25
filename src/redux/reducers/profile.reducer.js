import { ProfileConstants } from "../actions/constant";
const users = JSON.parse(window.localStorage.getItem("squser"))

const initState = {
    organizationProfile: [],
    loading: false,
    error: '',
    profileItem: users
};

const authReducer = (state = initState, action) => {
    switch (action.type) {
        case ProfileConstants.ORGANIZATION_PROFILE_REQUEST:
            return {
                ...state,
                loading: true,
                organizationProfile: [],
                error: ''
            };
        case ProfileConstants.ORGANIZATION_PROFILE_SUCCESS:
            return {
                ...state,
                loading: false,
                organizationProfile: action.payload,
                error: ''
            };
        case ProfileConstants.ORGANIZATION_PROFILE_FAILURE:
            return {
                ...state,
                loading: false,
                organizationProfile: [],
                error: action.payload
            };
        case ProfileConstants.PROFILE_AVATAR_REQUEST:
            return {
                ...state,
                profileItem: action.payload,
            };
        default:
            return state;
    }
};
export default authReducer;
