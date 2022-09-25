import React from "react";

import {
    Avatar as MuiAvatar
} from "@mui/material";

import getRandomInt from "../../utils/getRandomInt";
import intToChar from "../../utils/intToChar";
import stringToColor from '../../utils/stringToColor';

interface AvatarProps {
    className?: string;
    name: string;
}

const Avatar = (props: AvatarProps): JSX.Element => {
    const getInitial = (str: string): string => {
        if (str.length === 0)
            return (intToChar(getRandomInt(26)));
        return (str[0]);
    };

    return (
        <MuiAvatar
            className={props.className}
            sx={{ backgroundColor: stringToColor("Axel") }}
        >
            {getInitial(props.name)}
        </MuiAvatar>
    );
};

export default Avatar;