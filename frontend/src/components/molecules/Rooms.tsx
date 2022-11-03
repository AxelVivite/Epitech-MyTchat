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

interface RoomProps {
    'name': string;
    'date': string;
    'message': string;
}

export function Room(props: RoomProps): JSX.Element {
  return (
    <Box className="row width--full">
      <Avatar name={props.name} className="roomsClass" />
      <Box className="col pl--8" sx={{ width: 'calc(100% - 48px)' }}>
        <Box className="row mb--4">
          <Text variant="name" className="flex-grow--1 width--150">{props.name}</Text>
          <TextDate className="date">{props.date}</TextDate>
        </Box>
        <Text>{props.message}</Text>
      </Box>
    </Box>
  );
}

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

function Rooms(): JSX.Element {
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
