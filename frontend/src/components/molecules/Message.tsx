import React from 'react';

import {
  Box,
  Card,
} from '@mui/material';

import Avatar from '../atoms/Avatar';
import Text from '../atoms/typography/Text';
import TextDateTime from '../atoms/typography/TextDateTime';

// getMessagesHere from gsm

const Message = function Message(
  username: string,
  datetime: string,
  message: string,
): React.ReactElement<unknown, string> | null {
  return (
    <Card className={`row p--16 mb--16 mr--16 tchat--message ${username === 'Axel' && 'ml--auto'}`}>
      <Avatar
        name={username}
        className="mr--16 tchat--message__avatar"
      />
      <Box className="col flex-grow--1">
        <Box className="row flex--space-between mb--8">
          <Text variant="name" className="flex-shrink--1">{username}</Text>
          <TextDateTime className="ml--8 my--auto">{datetime}</TextDateTime>
        </Box>
        <Text>{message}</Text>
      </Box>
    </Card>
  );
};

/* const Message = (props: MessageProps): JSX.Element => {
    return (
        <Box className={`row ${username === "Axel" && "flex--end"}`}>
            {username !== "Axel" &&
                <Avatar name={username} className="mr--16" />
            }
            <Card className="row p--16 mb--16 width--70">
                <Box className="col m--0 flex-grow--1">
                    <Box className="row">
                        <Typography className="name">{username}</Typography>
                        <Typography className="datetime">{datetime}</Typography>
                    </Box>
                    <Typography className="message">{message}</Typography>
                </Box>
            </Card>
        </Box>
    );
}; */

export default Message;
