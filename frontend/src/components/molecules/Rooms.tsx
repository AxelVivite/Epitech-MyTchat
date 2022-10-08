import React from "react";

import {
    Box,
    List,
    ListItem,
    Typography,
} from "@mui/material";

import Avatar from "../atoms/Avatar";

interface RoomProps {
    "name": string;
    "date": string;
    "message": string;
}

export const Room = (props: RoomProps): JSX.Element => {
    return (
        <>
            <Box className="row width--full">
                <Avatar name={props.name} />
                <Box className="col pl--8" sx={{width: "calc(100% - 48px)"}}>
                    <Box className="row">
                        <Typography className="name flex-grow--1">{props.name}</Typography>
                        <Typography className="date">{props.date}</Typography>
                    </Box>
                    <Typography className="message">{props.message}</Typography>
                </Box>
            </Box>
        </>
    );
}

const example = [
    {
        "name": "Groupe révision pour le bac",
        "date": "11/22/2021",
        "message": "Salut, c'est pour avoir des infos sur le dernier devoir! Que faut-il faire ?"
    },
    {
        "name": "Alexis",
        "date": "10/22/2021",
        "message": "Salut, comment va ?"
    },
    {
        "name": "Marie",
        "date": "09/22/2021",
        "message": "Répond b****t"
    },
    {
        "name": "Les zinzolins",
        "date": "05/22/2021",
        "message": "Ca cuve ce soir ??"
    }
];

const Rooms = (): JSX.Element => {
    return (
        <List disablePadding>
            {example.map(item => (
                <ListItem disablePadding className="border--bottom border--lightgrey p--8">
                    <Room name={item.name} date={item.date} message={item.message} />
                </ListItem>
            ))}
        </List>
    );
}

export default Rooms;