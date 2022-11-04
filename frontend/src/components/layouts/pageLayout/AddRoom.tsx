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

interface usersInterface {
  username: string;
  id: number;
}

const users: readonly usersInterface[] = [
  { username: 'Axel', id: 1 },
  { username: 'Axel', id: 1 },
  { username: 'Axel', id: 1 },
  { username: 'Axel', id: 1 },
  { username: 'Axel', id: 1 },
  { username: 'Axel', id: 1 },
  { username: 'Axel', id: 1 },
  { username: 'Axel', id: 1 },
  { username: 'Axel', id: 1 },
  { username: 'Axel', id: 1 },
  { username: 'Axel', id: 1 },
  { username: 'Axel', id: 1 },
  { username: 'Axel', id: 1 },
  { username: 'Axel', id: 1 },
  { username: 'Axel', id: 1 },
  { username: 'Axel', id: 1 },
];

function AddRoom() {
  const { t } = useTranslation();

  return (
    <>
      <p className="title--room line-height--32">{t('new_room')}</p>
      <TextField placeholder={t('room_name')} variant="outlined" />
      <Autocomplete
        id="country-select-demo"
        sx={{ width: 300 }}
        options={users}
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
              placeholder={t('add_user')}
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
      <Chip label="Clickable" variant="outlined" onDelete={() => console.log('delete')} />
      <Button>{t('create')}</Button>
    </>
  );
}

export default AddRoom;
