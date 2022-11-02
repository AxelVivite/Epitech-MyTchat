import React, { useContext } from 'react';
import useWebSocket from 'react-use-websocket';
import { useGlobalState } from '../../utils/globalStateManager/globalStateInit';
import PageLayout from '../layouts/pageLayout/PageLayout';

const socketUrl = 'ws://localhost:3000/room/websocket';

const Home: React.FC = (props: any) => {
  // let [token] = useGlobalState("token");
  const { setState, state } = useGlobalState();
  const url = `${socketUrl}?token=${state.token}`;

  const websocketInstance = useWebSocket(
    url,
    {
      onOpen: () => console.log('Websocket open with effectice authentication'),
      onClose: () => console.log('Websocket close'),
      // Will attempt to reconnect on all close events, such as server shutting down
      // shouldReconnect: (closeEvent) => true,
    },
  );
  const newState = state;
  newState.websocket = websocketInstance;
  setState((prev) => ({ ...prev, ...newState }));

  return (
    <div className="Home">
      <PageLayout>
        <text>Test de navigation réussi !!!</text>

      </PageLayout>
    </div>
  );
};

export default Home;
