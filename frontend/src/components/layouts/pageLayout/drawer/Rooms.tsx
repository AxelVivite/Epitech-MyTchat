import React from "react";

import {
    Box,
    List,
    ListItem,
    Typography,
} from "@mui/material";


import Avatar from "../../../atoms/Avatar";

export const Room = (): JSX.Element => {
    return (
        <>
            <Avatar />
            <Box>
                <Typography>Title</Typography>
                <Typography>User1, Users2, User3...</Typography>
                <Typography>Last message...</Typography>
            </Box>
        </>
    );
}

const Rooms = (): JSX.Element => {
    return (
        <List>
            <ListItem>
                <Room />
            </ListItem>
        </List>
    );
}

export default Rooms;