import React from "react";

import {
    Autocomplete,
    Box,
    Button,
    Chip,
    TextField,
} from "@mui/material";

import AddIcon from '@mui/icons-material/Add';

import IconButton from "components/atoms/buttons/IconButton";

const users: readonly usersInterface[] = [
    { "username": "Axel", "id": 1 },
    { "username": "Axel", "id": 1 },
    { "username": "Axel", "id": 1 },
    { "username": "Axel", "id": 1 },
    { "username": "Axel", "id": 1 },
    { "username": "Axel", "id": 1 },
    { "username": "Axel", "id": 1 },
    { "username": "Axel", "id": 1 },
    { "username": "Axel", "id": 1 },
    { "username": "Axel", "id": 1 },
    { "username": "Axel", "id": 1 },
    { "username": "Axel", "id": 1 },
    { "username": "Axel", "id": 1 },
    { "username": "Axel", "id": 1 },
    { "username": "Axel", "id": 1 },
    { "username": "Axel", "id": 1 },
]

interface usersInterface {
    username: string;
    id: number;
}

const AddRoom = () => {
    return (
        <>
            <p className="title--room line-height--32">New room</p>
            <TextField placeholder="Room name" variant="outlined" />
            <Autocomplete
                id="country-select-demo"
                sx={{ width: 300 }}
                options={users}
                autoHighlight
                getOptionLabel={(option) => option.username}
                renderOption={(props, option) => (
                    <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                        {option.username}
                    </Box>
                )}
                renderInput={(params) => (
                    <div>
                        <TextField
                            {...params}
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
            <Chip label="Clickable" variant="outlined" onDelete={() => console.log("hihi")} />
            <Button>Create</Button>
        </>
    );
};

export default AddRoom;