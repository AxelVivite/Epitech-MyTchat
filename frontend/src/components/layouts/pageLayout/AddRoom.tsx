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

import { createRoom } from '../../../utils/roomsManagment';
import { useGlobalState } from '../../../utils/globalStateManager/globalStateInit';
import { getAllUsernames } from '../../../utils/userManagment';

import IconButton from '../../atoms/buttons/IconButton';
import Avatar from '../../atoms/Avatar';
import Title from '../../atoms/typography/Title';
import { Room } from '../../../utils/globalStateManager/globalStateObjects';

interface usersInterface {
  username: string;
  userId: string;
  key: number;
}

const emptyUser = { username: '', userId: '', key: -1 };

interface AddRoomProps {
  handleClose: () => void,
}

const AddRoom = function AddRoom({
  handleClose,
}: AddRoomProps) {
  const { state, setState } = useGlobalState();
  const { t } = useTranslation();
  const [newFriend, setNewFriend] = React.useState<usersInterface>(emptyUser);
  const [newFriends, setNewFriends] = React.useState<usersInterface[]>([]);
  const [name, setName] = React.useState('');
  const [everyUsers, setEveryUsers] = React.useState([{ username: 'Vous êtes seul sur le réseaux', userId: '1', key: 0 }]);
  const [allUsersLoaded, setUsersLoaded] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      setUsersLoaded(false);
      const res = await getAllUsernames(state.user?.username);
      setEveryUsers([...res]);
      setUsersLoaded(true);
    })();
  }, [state]);

  const getFriendIDs = () => {
    const friendIds: string[] = [];

    newFriends.forEach((value) => {
      friendIds.push(value.userId);
    });

    return friendIds;
  };

  const createNewRoom = async () => {
    let room: Room | null = null;
    if (newFriends.length === 0) {
      room = await createRoom(state.token as string, name, state.user?.userId as string);
    } else {
      const friends = getFriendIDs();
      room = await
      createRoom(state.token as string, name, state.user?.userId as string, friends as string[]);
    }
    if (room !== null) {
      const newState = state;
      newState.rooms?.push(room as never);
      setState((prev) => ({ ...prev, ...newState }));
      handleClose();
    }
    // here add a way to tell the user that the room creation had fail
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const index = everyUsers.findIndex((object) => object.username === newFriend.username);

    event.preventDefault();
    if (index > -1) {
      everyUsers.splice(index, 1);
      setNewFriends([...newFriends, newFriend]);
    }
  };

  const handleDeleteFriend = (event: any, item: usersInterface) => {
    const index = newFriends.findIndex((object) => object.username === item.username);

    if (index > -1) {
      const newFriendsTmp = [...newFriends];

      newFriendsTmp.splice(index, 1);
      setNewFriends(newFriendsTmp);
      everyUsers.push(item);
    }
  };

  return (
    <>
      <Title className="mb--24 mt--8" variant="header">{t('new_room')}</Title>
      <TextField
        className="mb--16 width--280"
        placeholder={t('room_name')}
        variant="outlined"
        onChange={(event) => setName(event.target.value)}
        value={name}
      />
      { allUsersLoaded ? (
        <>
          <Autocomplete
            key={everyUsers.toString()}
            sx={{ width: 300 }}
            options={everyUsers}
            autoHighlight
            onChange={(_, value) => value && setNewFriend(value)}
            getOptionLabel={(option) => option.username}
            isOptionEqualToValue={(option: any, value: any) => option.username === value.username}
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
            {newFriends.map((item) => (
              <Chip
                key={item.username}
                className="m--4"
                avatar={<Avatar name={item.username} className="" />}
                label={item.username}
                variant="outlined"
                onDelete={(event) => handleDeleteFriend(event, item)}
                size="small"
              />
            ))}
          </Box>
        </>
      ) : (
        <div>
          <text> Chargement des utilisateurs </text>
        </div>
      )}
      <Button
        disabled={name === ''}
        onClick={async () => createNewRoom()}
        variant="contained"
      >
        {t('create')}
      </Button>
    </>
  );
};

export default AddRoom;
