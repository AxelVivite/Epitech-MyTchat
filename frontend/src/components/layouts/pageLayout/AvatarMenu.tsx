import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
} from '@mui/material';

import DarkModeIcon from '@mui/icons-material/DarkMode';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import LightModeIcon from '@mui/icons-material/LightMode';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import TranslateIcon from '@mui/icons-material/Translate';

import i18n from '../../../services/translation/i18n';

import Avatar from '../../atoms/Avatar';

function AvatarMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [darkTheme, setDarkTheme] = React.useState<boolean>(false);
  const [lng, setLng] = React.useState<string>(i18n.language);
  const open = Boolean(anchorEl);
  const { t } = useTranslation();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangeTheme = () => {
    if (!darkTheme) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('darkTheme', 'true');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('darkTheme', 'true');
    }
    setDarkTheme(!darkTheme);
  };

  const changeLanguage = () => {
    if (lng === 'fr') {
      i18n.changeLanguage('en');
      setLng('en');
    } else {
      i18n.changeLanguage('fr');
      setLng('fr');
    }
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{ ml: 2 }}
        aria-controls={open ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Avatar name="Axel" className="avatarMenu" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem>
          <ListItemIcon>
            <PersonAddIcon fontSize="small" />
          </ListItemIcon>
          {t('invite_users')}
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <GroupRemoveIcon fontSize="small" />
          </ListItemIcon>
          {t('leave_room')}
        </MenuItem>
        <Divider />
        <MenuItem onClick={changeLanguage}>
          <ListItemIcon>
            <TranslateIcon fontSize="small" />
          </ListItemIcon>
          {lng === 'fr'
            ? 'English'
            : 'Français'}
        </MenuItem>
        <MenuItem onClick={handleChangeTheme}>
          <ListItemIcon>
            {darkTheme
              ? <LightModeIcon fontSize="small" />
              : <DarkModeIcon fontSize="small" />}
          </ListItemIcon>
          {darkTheme
            ? t('light_mode')
            : t('dark_mode')}
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          {t('logout')}
        </MenuItem>
      </Menu>
    </>
  );
}

export default AvatarMenu;
