import React from 'react';

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
  const [name, setName] = React.useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  return (
    <>
      <p className="title--room line-height--32">New room</p>
      <TextField placeholder="Room name" variant="outlined" required label="Required" onChange={handleChange} />
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
              placeholder="Users to add"
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
      <Button disabled={name === ''}>Create</Button>
    </>
  );
}

export default AddRoom;
