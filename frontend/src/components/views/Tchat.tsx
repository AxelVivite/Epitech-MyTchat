import React from 'react';
import Box from '@mui/material/Box';
// import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { getMessages } from '../../utils/roomsManagment';
import { useGlobalState } from '../../utils/globalStateManager/globalStateInit';
import PageLayout from '../layouts/pageLayout/PageLayout';
import Message from '../molecules/Message';
import InputMessage from '../molecules/InputBarMessage';
import { Post } from '../../utils/globalStateManager/globalStateObjects';
// import { createRoom } from '../../utils/roomsManagment';

function MessagesLoad() {
  const { t } = useTranslation();

  return (
    <div>
      <text>{t('messages_loading')}</text>
    </div>
  );
}

function Tchat() {
  // const [token] = useGlobalState("token");
  // const [user] = useGlobalState("user");

  // const createRoomTest = async () => {
  //   await createRoom('token', 'leTestEstmignon',
  // ['eyJhbGciNzYsImV4cCI6MTY2NjEwMzk3Nn0.ys0wYXdvT6ppHh1qZk8vXqn7rin25PxPR6Zz-AQWjK0']);
  // };
  const { state } = useGlobalState();
  const [messages, setMessages] = React.useState([] as Post[]);
  const [messagesAreLoaded, setMessagesAreLoaded] = React.useState(false);

  const onSubmit = () => {
    console.log('ICH');
  };

  React.useEffect(() => {
    (async () => {
      setMessagesAreLoaded(false);
      const messagesHere = await getMessages(state.token as string, state.activeRoom as string);
      console.log('message loadé');
      console.log(messagesHere);
      setMessages(messagesHere);
      setMessagesAreLoaded(true);
    })();
    const element = document.getElementById('tchat');

    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }, [state.activeRoom, state.token]);

  const loadMessages = () => messages.map((value: Post) => (
    <Message
      username={value?.sender?.username as string}
      datetime={value?.messageDate}
      message={value?.message}
    />
  ));

  return (
    <PageLayout>
      <Box
        sx={{ minHeight: 'calc(100vh - 96px)', maxHeight: 'calc(100vh - 96px)' }}
        className="col"
      >
        <Box
          id="tchat"
          sx={{ maxHeight: 'calc(100vh - 96px - 72px)' }}
          className="pl--8 mr--8 tchat__scrollbar flex-shrink--1 mb--16 tchat"
        >
          {
            messagesAreLoaded ? (
              loadMessages()
            ) : (
              <MessagesLoad />
            )
          }
        </Box>
        <InputMessage onSubmit={onSubmit} messages={messages} setMessages={setMessages} />
      </Box>
    </PageLayout>
  );
}

export default Tchat;
