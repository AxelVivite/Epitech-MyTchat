import React from 'react';

import {
  Box,
  List,
  ListItem,
} from '@mui/material';

import Avatar from '../atoms/Avatar';
import Text from '../atoms/typography/Text';
import TextDate from '../atoms/typography/TextDate';

// here add gsm for the rooms

export const Room = function Room(
  name: string,
  date: string,
  message: string,
): React.ReactElement<unknown, string> | null {
  return (
    <Box className="row width--full">
      <Avatar name={name} />
      <Box className="col pl--8" sx={{ width: 'calc(100% - 48px)' }}>
        <Box className="row mb--4">
          <Text variant="name" className="flex-grow--1 width--150">{name}</Text>
          <TextDate className="date">{date}</TextDate>
        </Box>
        <Text>{message}</Text>
      </Box>
    </Box>
  );
};

const example = [
  {
    name: 'Groupe révision pour le bac',
    date: '11/22/2021',
    message: "Salut, c'est pour avoir des infos sur le dernier devoir! Que faut-il faire ?",
  },
  {
    name: 'Alexis',
    date: '10/22/2021',
    message: 'Salut, comment va ?',
  },
  {
    name: 'Marie',
    date: '09/22/2021',
    message: 'Répond b****t',
  },
  {
    name: 'Les zinzolins',
    date: '05/22/2021',
    message: 'Ca cuve ce soir ??',
  },
];

function Rooms(): React.ReactElement<unknown, string> | null {
  return (
    <List disablePadding>
      {example.map((item) => (
        <ListItem
          disablePadding
          className="border--bottom border--contrast p--8"
          key={`room-${item.name}`}
        >
          <Room name={item.name} date={item.date} message={item.message} />
        </ListItem>
      ))}
    </List>
  );
}

export default Rooms;
