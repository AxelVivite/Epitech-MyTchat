import { createGlobalState } from 'react-hooks-global-state';
import React, {
  createContext, Dispatch, SetStateAction, useContext, useReducer, useState,
} from 'react';
import { User, Room } from './globalStateObjects.ts';

const userInit: User = { userId: '', username: '' };
const rooms: [Room | null] = [null]; // TODO: maybe it will be necessary to setup this in an other way when connected it with the reste of the app for using

export interface GlobalStateInterface {
    user: User;
    rooms: [Room | null];
    token: string;
    lang: string; // fr or eng to check the current language
    darkModeIsOn: boolean;
    websocket?: any;
}

const GlobalStateContext = createContext({
  state: {} as Partial<GlobalStateInterface>,
  setState: {} as Dispatch<SetStateAction<Partial<GlobalStateInterface>>>,
});

function GlobalStateProvider({
  children,
  value = {} as GlobalStateInterface,
}: {
    children: React.ReactNode;
    value?: Partial<GlobalStateInterface>;
  }) {
  const [state, setState] = useState(value);
  return (
    <GlobalStateContext.Provider value={{ state, setState }}>
      {children}
    </GlobalStateContext.Provider>
  );
}

const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error('useGlobalState must be used within a GlobalStateContext');
  }
  return context;
};

export { GlobalStateProvider, useGlobalState };
