import { createGlobalState } from "react-hooks-global-state";
import { User, Room } from "./globalStateObjects";
import React, { createContext, Dispatch, SetStateAction, useContext, useReducer, useState } from 'react';
import AppReducer from './AppReducer';

let userInit: User = {userId: "", username: ""};
let rooms: [Room | null] = [null]; // TODO: maybe it will be necessary to setup this in an other way when connected it with the reste of the app for using

export interface GlobalStateInterface {
    user: User;
    rooms: [Room | null];
    token: string;
    lang: string; //fr or eng to check the current language
    darkModeIsOn: boolean;
    websocket?: any;
};

const initialState = {
    user: userInit,
    rooms: rooms,
    token: "",
    lang: ["eng", "fr"],
    darkModeIsOn: false,
    websocket: null,
};



const GlobalStateContext = createContext({
    state: {} as Partial<GlobalStateInterface>,
    setState: {} as Dispatch<SetStateAction<Partial<GlobalStateInterface>>>,
  });
  
  const GlobalStateProvider = ({
    children,
    value = {} as GlobalStateInterface,
  }: {
    children: React.ReactNode;
    value?: Partial<GlobalStateInterface>;
  }) => {
    const [state, setState] = useState(value);
    return (
      <GlobalStateContext.Provider value={{ state, setState }}>
        {children}
      </GlobalStateContext.Provider>
    );
  };
  
  const useGlobalState = () => {
    const context = useContext(GlobalStateContext);
    if (!context) {
      throw new Error("useGlobalState must be used within a GlobalStateContext");
    }
    return context;
  };
  
  export { GlobalStateProvider, useGlobalState };
// export { setGlobalState, useGlobalState };


// const initialState = {
//    shoppingList : []
// }

// export const GlobalContext = createContext(initialState);

// export const GlobalProvider = ({ children }) => {
//    const [state, dispatch] = useReducer(AppReducer, initialState);

//    // Actions for changing state

//    function addWebsocket(item: any) {
//        dispatch({
//            type: 'ADD_WEBSOCKET',
//            payload: item,
//        });
//    }
//    function removeWebsocket(item: any) {
//     dispatch({
//         type: 'REMOVE_WEBSOCKET',
//         payload: item,
//     });
// }
//    function addToken(item: any) {
//        dispatch({
//            type: 'ADD_TOKEN',
//            payload: item
//        });
//    }
//    function removeToken(item: any) {
//        dispatch({
//            type: 'REMOVE_TOKEN',
//            payload: item
//        });
//    }
//    function addUser(item: any) {
//     dispatch({
//         type: 'ADD_USER',
//         payload: item
//     });
// }
//     function removeUser(item: any) {
//     dispatch({
//         type: 'REMOVE_USER',
//         payload: item
//     });
// }
//     function updateRooms(item: any) {
//         dispatch({
//             type: 'UPDATE_ROOMS',
//             payload: item
//         });
//     }
//     function removeRooms(item: any) {
//         dispatch({
//             type: 'REMOVE_ROOMS',
//             payload: item
//         });
//     }
//     function switchMode(item: any) {
//         dispatch({
//             type: 'SWITCH_MODE',
//             payload: item
//         });
//     }
//     function switchLang(item: any) {
//         dispatch({
//             type: 'SWITCH_LANG',
//             payload: item
//         });
//     }


//    return(
//       <GlobalContext.Provider value = {{user : state.user, rooms: state.rooms, token: state.token, lang: state.lang, darkModeIsOn: state.darkModeIsOn, addToken, removeToken, addWebsocket, removeWebsocket, addUser, removeUser, updateRooms, removeRooms, switchMode, switchLang}}> 
//         {children} 
//    </GlobalContext.Provider>
//    )
// }