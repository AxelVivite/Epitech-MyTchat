import React from 'react';

import {
  Avatar as MuiAvatar,
} from '@mui/material';

import getRandomInt from '../../utils/getRandomInt';
import intToChar from '../../utils/intToChar';
import stringToColor from '../../utils/stringToColor';

interface AvatarProps {
  className: string | undefined,
  name: string,
}

const Avatar = function Avatar({
  className,
  name,
}: AvatarProps) {
  const getInitial = (str: string): string => {
    if (str.length === 0) return (intToChar(getRandomInt(26)));
    if (str.indexOf(' ') >= 0) return (`${str[0]}${str.split(' ')[1][0]}`);
    return (str[0]);
  };

  return (
    <MuiAvatar
      className={className}
      sx={{ backgroundColor: stringToColor(name) }}
    >
      {getInitial(name).toUpperCase()}
    </MuiAvatar>
  );
};

export default Avatar;
