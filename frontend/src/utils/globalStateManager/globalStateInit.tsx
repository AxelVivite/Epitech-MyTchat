import React, {
  createContext, Dispatch, SetStateAction, useContext, useState,
} from 'react';
import { User, Room } from './globalStateObjects';

export interface GlobalStateInterface {
    user: User;
    rooms: Room[] | never[] | null;
    token: string;
    lang: string;
    darkModeIsOn: boolean;
    websocket?: object;
    activeRoom: string,
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
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <GlobalStateContext.Provider value={{ state, setState }}>
      {children}
    </GlobalStateContext.Provider>
  );
}

GlobalStateProvider.defaultProps = {
  value: {},
};

const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error('useGlobalState must be used within a GlobalStateContext');
  }
  return context;
};

export { GlobalStateProvider, useGlobalState };
