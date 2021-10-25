import { combineReducers } from "redux";
import authReducer from "./auth.reducers";
import userReducer from "./user.reducer";
import diagramReducer from "./diagram.reducer";
import websocketConstant from "./websocket.reducer";
import Orgprofile from "./profile.reducer";
import projectReducer from "./project.reducer";


const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  diagram: diagramReducer,
  socket: websocketConstant,
  orgprofile: Orgprofile,
  projects: projectReducer,
});
export default rootReducer;
