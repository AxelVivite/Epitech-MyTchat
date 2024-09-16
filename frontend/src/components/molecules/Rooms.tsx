import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  Box,
  ListItemButton,
  List,
  ListItem,
} from '@mui/material';

import { useGlobalState } from '../../utils/globalStateManager/globalStateInit';
import { parseDate } from '../../utils/parseDatetime';

import TextDate from '../atoms/typography/TextDate';
import Avatar from '../atoms/Avatar';
import Text from '../atoms/typography/Text';

interface RoomProps {
  name: string,
  date: string,
  message: string,
}

export const RoomBox = function RoomBox({
  name,
  date,
  message,
}: RoomProps) {
  const { t } = useTranslation();
  const noMessage = t('any_message_historic');

  return (
    <Box className="row width--full">
      <Avatar name={name} className="roomsClass" />
      <Box className="col pl--8" sx={{ width: 'calc(100% - 48px)' }}>
        <Box className="row mb--4">
          <Text variant="name" className="flex-grow--1 width--150">{name}</Text>
          <TextDate className="date">{date && parseDate(date)}</TextDate>
        </Box>
        <Text className={message === '' ? 'text--italic' : ''}>
          {message === '' ? noMessage : message}
        </Text>
      </Box>
    </Box>
  );
};

function Rooms() {
  const { state, setState } = useGlobalState();

  const changeRoom = (roomId: string) => {
    const newState = state;
    newState.activeRoom = roomId;

    setState((prev) => ({ ...prev, ...newState }));
  };

  return (
    <List disablePadding>
      {state?.rooms?.map((item?) => (
        <ListItem
          disablePadding
          className="border--bottom border--contrast"
          key={`room-${item?.name}`}
        >
          <ListItemButton onClick={() => changeRoom(item?.roomId)} className="p--8">
            <RoomBox
              name={item?.name as string}
              date={item?.lastMessage?.messageDate as string}
              message={item?.lastMessage?.message as string}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}

export default Rooms;
