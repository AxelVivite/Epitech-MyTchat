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
import Title from '../../atoms/typography/Title';
import { useGlobalState } from '../../../utils/globalStateManager/globalStateInit';
import AvatarMenu from './AvatarMenu';

interface HeaderProps {
  handleClickDrawerButton: () => void,
}

const Header = function Header({
  handleClickDrawerButton,
}: HeaderProps) {
  const { state } = useGlobalState();

  return (
    <AppBar position="sticky" className="mb--16">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <IconButton
          onClick={handleClickDrawerButton}
          sx={{
            display: { xs: 'block', md: 'none' },
          }}
        >
          <MenuIcon />
        </IconButton>
        <Box className="row">
          <img src={state.darkModeIsOn ? logo : logoDark} alt="logo" className="width--40 mr--16" />
          <Title className="my--auto" variant="header">
            {`Cognac-Tabasco ${state.user?.username}`}
          </Title>
        </Box>
        <AvatarMenu />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
