import React from 'react';

import {
  Box,
  Card,
} from '@mui/material';

import Avatar from '../atoms/Avatar';
import Text from '../atoms/typography/Text';
import TextDateTime from '../atoms/typography/TextDateTime';
import { parseDatetime } from '../../utils/parseDatetime';
import { useGlobalState } from '../../utils/globalStateManager/globalStateInit';

interface MessageProps {
  username: string,
  datetime: string,
  message: string,
}

const Message = function Message({
  username,
  datetime,
  message,
}: MessageProps) {
  const { state } = useGlobalState();

  return (
    <Card className={`row p--16 mb--16 mr--16 tchat--message ${username === state.user?.username && 'ml--auto'}`}>
      <Avatar
        name={username}
        className="mr--16 tchat--message__avatar"
      />
      <Box className="col flex-grow--1">
        <Box className="row flex--space-between mb--8">
          <Text variant="name" className="flex-shrink--1">{username}</Text>
          <TextDateTime className="ml--8 my--auto">{parseDatetime(datetime)}</TextDateTime>
        </Box>
        <Text>
          {message}
        </Text>
      </Box>
    </Card>
  );
};

export default Message;
