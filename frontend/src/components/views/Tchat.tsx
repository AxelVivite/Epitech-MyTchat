import React from 'react';
import Box from '@mui/material/Box';

import PageLayout from '../layouts/pageLayout/PageLayout';
import WelcomeBack from '../molecules/WelcomeBack';
import Message from '../molecules/Message';
import InputMessage from '../molecules/InputBarMessage';
import { Post } from '../../utils/globalStateManager/globalStateObjects';
import { getMessages } from '../../utils/roomsManagment';
import { useGlobalState } from '../../utils/globalStateManager/globalStateInit';

function Tchat() {
  const { state, setState } = useGlobalState();
  const [messages, setMessages] = React.useState([] as Post[]);

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

  console.log(state);

  return (
    <PageLayout>
      <Box
        sx={{ minHeight: 'calc(100vh - 96px)', maxHeight: 'calc(100vh - 96px)' }}
        className="col"
      >
        {state.activeRoom ? (
          <>
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
              messages={messages}
              setMessages={setMessages}
            />
          </>
        ) : (
          <WelcomeBack />
        )}
      </Box>
    </PageLayout>
  );
}

export default Tchat;
