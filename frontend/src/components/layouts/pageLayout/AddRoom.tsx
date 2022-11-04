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
import { getAllUsers } from '../../../utils/userManagment';
import { useGlobalState } from '../../../utils/globalStateManager/globalStateInit';
import { createRoom } from '../../../utils/roomsManagment';

import IconButton from '../../atoms/buttons/IconButton';
import { Room } from '../../../utils/globalStateManager/globalStateObjects';

interface usersInterface {
  username: string;
  userId: string;
  key: number;
}

// const users: readonly usersInterface[] = [
//   { username: 'Axel', id: 1 },
//   { username: 'Axel', id: 1 },
//   { username: 'Axel', id: 1 },
//   { username: 'Axel', id: 1 },
//   { username: 'Axel', id: 1 },
//   { username: 'Axel', id: 1 },
//   { username: 'Axel', id: 1 },
//   { username: 'Axel', id: 1 },
//   { username: 'Axel', id: 1 },
//   { username: 'Axel', id: 1 },
//   { username: 'Axel', id: 1 },
//   { username: 'Axel', id: 1 },
//   { username: 'Axel', id: 1 },
//   { username: 'Axel', id: 1 },
//   { username: 'Axel', id: 1 },
//   { username: 'Axel', id: 1 },
// ];

function AddRoom() {
  const { t } = useTranslation();
  const { state, setState } = useGlobalState();
  const [name, setName] = React.useState('');
  const [everyUsers, setEveryUsers] = React.useState([{ username: 'Vous êtes seul sur le réseaux', userId: '1', key: 0 }]);
  const [allUsersLoaded, setUsersLoaded] = React.useState(false);
  // eslint-disable-next-line no-unused-vars
  const [userToAdd, setUserToAdd] = React.useState(['']);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const getAllUsernames = async () => {
    try {
      const allUsers = await getAllUsers();
      if (allUsers === null) {
        return [];
      }
      return allUsers;
    } catch (err) {
      return [];
    }
  };

  React.useEffect(() => {
    (async () => {
      setUsersLoaded(false);
      const res = await getAllUsernames();
      if (res !== null || undefined || []) {
        console.log(`users == ${res}`);
        setUsersLoaded(true);
        setEveryUsers(res as usersInterface[]);
      }
    })();
  }, []);
  const createNewRoom = async () => {
    let room: Room | null = null;
    if (userToAdd[0] === '') {
      room = await createRoom(state.token as string, name, state.user?.userId as string);
    } else {
      room = await
      createRoom(state.token as string, name, state.user?.userId as string, userToAdd as [string]);
    }
    if (room !== null) {
      const newState = state;
      newState.rooms?.push(room as never);
      setState((prev) => ({ ...prev, ...newState }));
    }
    // here add a way to tell the user that the room creation had fail
  };

  // const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //   // setEveryUsers(event.target.)
  //   // console.log(event.target);
  // };

  return (
    <>
      <p className="title--room line-height--32">{t('new_room')}</p>
      <TextField placeholder={t('room_name')} variant="outlined" required label="Required" onChange={handleChange} />
      { allUsersLoaded ? (
        <form>
          {/* <form onSubmit={(event) => handleSubmit(event)}> */}
          <Autocomplete
          // multiple
            autoHighlight
            id="tags-standard"
            options={everyUsers}
            getOptionLabel={(option) => option.username}
          // eslint-disable-next-line max-len
          // renderTags={(value: readonly usersInterface[], getTagProps) => value.map((option: usersInterface, index: number) => (
          //   // eslint-disable-next-line react/jsx-props-no-spreading
          //   <Chip variant="outlined" label={option.username} {...getTagProps({ index })} />
          // ))}
            renderInput={(params) => (
              <TextField
              // eslint-disable-next-line react/jsx-props-no-spreading
                {...params}
                variant="standard"
                label="Selectionner un utilisateur"
                placeholder={t('add_user')}
              />
            )}
          />
          <IconButton
            className="input-bar--btn"
            type="submit"
            variant="outlined"
          >
            <AddIcon />
          </IconButton>
        </form>
      // <Autocomplete
      //   // multiple
      //   id="country-select-demo"
      //   sx={{ width: 300 }}
      //   options={everyUsers}
      //   autoHighlight
      //   getOptionLabel={(option) => option.username}
      //   renderOption={(props, option) => (
      //     <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }}>
      //       {option.username}
      //     </Box>
      //   )}
      //   renderInput={(params) => (
      // <div>
      //   <TextField
      //     // Mui doc highly recommand to do this
      //     // eslint-disable-next-line react/jsx-props-no-spreading
      //     {...params}
      //     placeholder="Users to add"
      //     inputProps={{
      //       ...params.inputProps,
      //       autoComplete: 'new-password', // disable autocomplete and autofill
      //     }}
      //   />
      //   <IconButton
      //     className="input-bar--btn"
      //     type="submit"
      //     variant="outlined"
      //   >
      //     <AddIcon />
      //   </IconButton>
      // </div>
      //   )}
      // />
      )
        : (
          <Autocomplete
            id="country-select-demo"
            sx={{ width: 300 }}
            options={[{ username: 'Auncun autre utilisateurs à afficher pour le moment', userId: '1' }]}
            autoHighlight
            getOptionLabel={(option) => option.username}
            renderOption={(props, option) => (
              <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }}>
                {option.username}
              </Box>
            )}
            renderInput={(params) => (
              <div>
                <TextField
                  placeholder="Any Users"
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: 'new-password', // disable autocomplete and autofill
                  }}
                />
                <IconButton
                  className="input-bar--btn"
                  type="submit"
                  variant="outlined"
                >
                  <AddIcon />
                </IconButton>
              </div>
            )}
          />
        )}
      <Chip label="Clickable" variant="outlined" onDelete={() => console.log('delete')} />
      <Button
        disabled={name === ''}
        onClick={async () => {
          console.log('clique');
          await createNewRoom();
        }}
      >
        {t('create')}
      </Button>
    </>
  );
}

export default AddRoom;
