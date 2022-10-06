import { combineReducers } from "redux";
import websocketReducer from "./websocketReducer";
import counterReducer from "./TestReducer";

export default combineReducers({websocket: websocketReducer, counter: counterReducer});