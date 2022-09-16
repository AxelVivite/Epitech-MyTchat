import React from "react";

import {
    Avatar,
    Box,
    List,
    ListItem,
    Typography,
} from "@mui/material";

import getInitials from "../../../../utils/getInitials";

export const Room = (): JSX.Element => {
    return (
        <>
            <Avatar>
                {getInitials("Axel Virot")}
            </Avatar>
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