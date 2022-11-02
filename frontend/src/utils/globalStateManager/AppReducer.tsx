import React from 'react';
 
// eslint-disable-next-line import/no-anonymous-default-export
export default (state: any, action: any) => {
   switch(action.type) {
       case 'ADD_TOKEN':
           return {
                   token: [action.payload, ...state.token]
           }
       case 'REMOVE_TOKEN':
           return {
               token: ""
           }
        case 'ADD_WEBSOCKET':
            return {
                websocket: [action.payload, ...state.websocket]
            }
        case 'REMOVE_WEBSOCKET':
            return {
                websocket: null
            }
        case 'ADD_USER':
            return {
                    user: [action.payload, ...state.user]
            }
        case 'REMOVE_USER':
            return {
                user: {userId: "", username: ""}
            }
        case 'UPDATE_ROOMS':
            return {
                    rooms: [action.payload, ...state.rooms]
            }
        case 'REMOVE_ROOMS':
            return {
                rooms: [] 
            }
        case 'SWITCH_MODE':
            return {
                    darkModeIsOn: state.darkModeIsOn!
            }
        case 'SWITCH_LANG':
            return {
                lang: state.lang === "en" ? "fr" : "en"
            }
       default:
           return state;
   }
}