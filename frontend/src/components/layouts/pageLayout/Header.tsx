import React from 'react';

import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import logo from '../../../assets/logo.png';
import logoDark from '../../../assets/logo-dark.png';
import Button from '../../atoms/buttons/Button';
import Title from '../../atoms/typography/Title';
import { useGlobalState } from '../../../utils/globalStateManager/globalStateInit';
import Avatar from '../../atoms/Avatar';
import AvatarMenu from './AvatarMenu';

interface HeaderProps {
    handleClickDrawerButton: () => void;
}

function Header(props: HeaderProps): JSX.Element {
  const { setState, state } = useGlobalState();
  const darkTheme = localStorage.getItem('darkTheme') === 'false';

  return (
    <AppBar position="sticky" className="mb--16">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <IconButton
          onClick={props.handleClickDrawerButton}
          sx={{
            display: { xs: 'block', md: 'none' },
          }}
        >
          <MenuIcon />
        </IconButton>
        <Box className="row">
          <img src={state.darkModeIsOn ? logo : logoDark} alt="logo" className="width--40 mr--16" />
          <Title className="my--auto" variant="header">
            RoomName

          </Title>
          <text>{` ${state.user?.username}`}</text>

        </Box>
        <AvatarMenu />
      </Toolbar>
    </AppBar>
  );
}

export default Header;
