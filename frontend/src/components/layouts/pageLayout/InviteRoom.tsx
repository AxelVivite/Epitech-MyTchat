import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  Autocomplete,
  Box,
  Button,
  Chip,
  TextField,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';

import IconButton from '../../atoms/buttons/IconButton';
import Avatar from '../../atoms/Avatar';
import Title from '../../atoms/typography/Title';

interface usersInterface {
  username: string;
  userId: string;
  key: number;
}

const users: usersInterface[] = [
  { username: 'Axel', userId: 'k', key: 1 },
  { username: 'Zoe', userId: 'kk', key: 2 },
  { username: 'Hugo', userId: 'kkk', key: 3 },
  { username: 'Manon', userId: 'kkkk', key: 4 },
  { username: 'Jean-Claude', userId: 'kkkkk', key: 5 },
];

const emptyUser = { username: '', userId: '', key: -1 };

interface InviteRoomProps {
  handleClose: () => void,
}

const InviteRoom = function InviteRoom({
  handleClose,
}: InviteRoomProps) {
  const { t } = useTranslation();
  const [newFriend, setNewFriend] = React.useState<usersInterface>(emptyUser);
  const [newFriends, setNewFriends] = React.useState<usersInterface[]>([]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const index = users.findIndex((object) => object.username === newFriend.username);

    event.preventDefault();
    if (index > -1) {
      users.splice(index, 1);
      setNewFriends([...newFriends, newFriend]);
    }
  };

  const handleDeleteFriend = (item: usersInterface) => {
    const index = newFriends.findIndex((object) => object.username === item.username);

    if (index > -1) {
      const newFriendsTmp = [...newFriends];

      newFriendsTmp.splice(index, 1);
      setNewFriends(newFriendsTmp);
      users.push(item);
    }
  };

  return (
    <>
      <Title className="mb--24 mt--8" variant="header">{t('invite_room')}</Title>
      <Autocomplete
        key={users.toString()}
        sx={{ width: 300 }}
        options={users}
        autoHighlight
        onChange={(_, value) => value && setNewFriend(value)}
        getOptionLabel={(option) => option.username}
        isOptionEqualToValue={
          (option: usersInterface, value: usersInterface) => option.username === value.username
        }
        renderOption={(props, option) => (
          // eslint-disable-next-line react/jsx-props-no-spreading
          <Box component="li" className="p--8" {...props}>
            <Avatar name={option.username} className="mr--16 width--32 height--32" />
            {option.username}
          </Box>
        )}
        renderInput={(params) => (
          <form
            className="row flex--center"
            onSubmit={(event) => handleSubmit(event)}
          >
            <TextField
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...params}
              classes={{ root: 'mb--16 width--224' }}
              placeholder={t('add_user')}
              inputProps={{
                ...params.inputProps,
              }}
            />
            <IconButton
              className=" ml--16 mr--0 m--8 input-bar--btn"
              type="submit"
              variant="outlined"
            >
              <AddIcon />
            </IconButton>
          </form>
        )}
      />
      <Box className="row mb--16 flex--start flex--wrap width--280">
        {
          newFriends.map((item) => (
            <Chip
              key={item.username}
              className="m--4"
              avatar={<Avatar name={item.username} className="" />}
              label={item.username}
              variant="outlined"
              onDelete={() => handleDeleteFriend(item)}
              size="small"
            />
          ))
        }
      </Box>
      <Button
        disabled={newFriends.length === 0}
        onClick={handleClose}
        variant="contained"
      >
        {t('invite')}
      </Button>
    </>
  );
};

export default InviteRoom;
