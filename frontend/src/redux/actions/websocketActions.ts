import { SET, DELETEWEBSOCKET } from "../WebsocketTypes";

export const set = (websocketInstance: any) => {
    return {
        type: SET,
    };
};

export const deleteWebsocket = () => {
    return {
        type: DELETEWEBSOCKET,
    };
};