import { SET, DELETEWEBSOCKET } from "../WebsocketTypes";

const initialState = {
    websocket: null
}

const websocketReducer = (state = initialState, action: any, websocketInstance?: any) => {
    switch(action.type) {
        case SET:
            return {
                state,
                websocket: websocketInstance
            }
        case DELETEWEBSOCKET:
            return {
                state,
                websocket: null
            }
        default:
            return state;
    }
}

export default websocketReducer;
