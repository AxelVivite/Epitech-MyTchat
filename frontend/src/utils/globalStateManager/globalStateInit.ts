import { createGlobalState } from "react-hooks-global-state";
import { User, Room } from "./globalStateObjects";

let userInit: User = {userId: "", username: ""};
let rooms: [Room | null] = [null]; // TODO: maybe it will be necessary to setup this in an other way when connected it with the reste of the app for using

const { setGlobalState, useGlobalState} = createGlobalState({
    user: userInit,
    rooms: rooms,
    token: "",
});

export { setGlobalState, useGlobalState };
