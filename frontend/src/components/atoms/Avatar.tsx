import React from "react";

import {
    Avatar as MuiAvatar
} from "@mui/material";

import getRandomInt from "../../utils/getRandomInt";
import intToChar from "../../utils/intToChar";
import stringToColor from '../../utils/stringToColor';

const Avatar = (): JSX.Element => {
    const getInitial = (str: string): string => {
        if (str.length === 0)
            return (intToChar(getRandomInt(26)));
        return (str[0]);
    };

    return (
        <MuiAvatar sx={{ backgroundColor: stringToColor("Axel") }}>
            {getInitial("Axel")}
        </MuiAvatar>
    );
};

export default Avatar;