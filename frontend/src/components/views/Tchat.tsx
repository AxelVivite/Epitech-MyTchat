import React from 'react';
import Box from '@mui/material/Box';
// import { Button } from '@mui/material';

import { getMessages } from '../../utils/roomsManagment';
import { useGlobalState } from '../../utils/globalStateManager/globalStateInit';
import PageLayout from '../layouts/pageLayout/PageLayout';
import Message from '../molecules/Message';
import InputMessage from '../molecules/InputBarMessage';
import { Post } from '../../utils/globalStateManager/globalStateObjects';
// import { createRoom } from '../../utils/roomsManagment';

function Tchat() {
  // const [token] = useGlobalState("token");
  // const [user] = useGlobalState("user");

  // const createRoomTest = async () => {
  //   await createRoom('token', 'leTestEstmignon',
  // ['eyJhbGciNzYsImV4cCI6MTY2NjEwMzk3Nn0.ys0wYXdvT6ppHh1qZk8vXqn7rin25PxPR6Zz-AQWjK0']);
  // };
  const { state, setState } = useGlobalState();
  const [messages, setMessages] = React.useState([] as Post[]);

  const onSubmit = () => {
    console.log('ICH');
  };

  React.useEffect(() => {
    (async () => {
      const messagesHere = await getMessages(state.token as string, state.activeRoom as string);
      setMessages(messagesHere);
    })();
    const element = document.getElementById('tchat');

    if (element) {
      element.scrollTop = element.scrollHeight;
    }

    if (localStorage.getItem('darkTheme') === 'true') {
      document.body.classList.add('dark-theme');
      localStorage.setItem('darkTheme', 'true');
      setState((prev) => ({ ...prev, darkModeIsOn: true }));
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('darkTheme', 'false');
      setState((prev) => ({ ...prev, darkModeIsOn: false }));
    }
  }, [state.token, state.activeRoom, setState]);

  return (
    <PageLayout>
      {state.activeRoom
        && (
          <Box
            sx={{ minHeight: 'calc(100vh - 96px)', maxHeight: 'calc(100vh - 96px)' }}
            className="col"
          >
            <Box
              id="tchat"
              sx={{ maxHeight: 'calc(100vh - 96px - 72px)' }}
              className="pl--8 mr--8 tchat__scrollbar flex-grow--1 mb--16 tchat"
            >
              {
                !messages ? <div /> : messages.map((value: Post) => (
                  <Message
                    key={`key-message-${value?.sender?.username}-${value?.messageDate}-${value?.message}`}
                    username={value?.sender?.username as string}
                    datetime={value?.messageDate}
                    message={value?.message}
                  />
                ))
              }
            </Box>
            <InputMessage
              onSubmit={onSubmit}
              messages={messages}
              setMessages={setMessages}
            />
          </Box>
        )}
    </PageLayout>
  );
}

export default Tchat;
