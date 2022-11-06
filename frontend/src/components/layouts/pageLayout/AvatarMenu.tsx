import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

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

import { toastifyError, toastifySuccess } from '../../../utils/toastify';
import Avatar from '../../atoms/Avatar';
import i18n from '../../../services/translation/i18n';
import { useGlobalState } from '../../../utils/globalStateManager/globalStateInit';
import ModalInviteRoom from './ModalInviteRoom';
import ModalConfirmation from './ModalConfirmation';
import { makeLeaveRoom } from '../../../utils/roomsManagment';

function AvatarMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [lng, setLng] = React.useState<string>(i18n.language);
  const navigate = useNavigate();
  const { state, setState } = useGlobalState();
  const [darkTheme, setDarkTheme] = React.useState<boolean>(false);
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
      setState((prev) => ({ ...prev, darkModeIsOn: true }));
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('darkTheme', 'false');
      setState((prev) => ({ ...prev, darkModeIsOn: false }));
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

  const logout = () => {
    setState({});
    navigate('/sign-in');
  };

  React.useEffect(() => {
    setDarkTheme(state.darkModeIsOn !== undefined ? state.darkModeIsOn : false);
  }, [state.darkModeIsOn]);

  const leaveRoom = async () => {
    const roomToLeave = state.activeRoom;

    const roomIsLived = await makeLeaveRoom(roomToLeave as string, state.token as string);
    if (roomIsLived) {
      const newState = state;
      const newRoomList = newState.rooms?.filter((room) => room.roomId !== roomToLeave);
      let newActiveRoom = '';
      if (newRoomList !== undefined && newRoomList?.length === 0) {
        newActiveRoom = newRoomList[0]?.roomId;
      }
      newState.rooms = newRoomList;
      newState.activeRoom = newActiveRoom;
      setState((prev) => ({ ...prev, ...newState }));
      handleClose();
      toastifySuccess(t('success_leave_room'));
    } else {
      handleClose();
      toastifyError(t('fail_leave_room'));
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
        <Avatar
          name={state.user ? state.user?.username : ''}
          className="avatarMenu"
        />
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
        {state.activeRoom
          && (
            <>
              <ModalInviteRoom>
                <MenuItem>
                  <ListItemIcon>
                    <PersonAddIcon fontSize="small" />
                  </ListItemIcon>
                  {t('invite_users')}
                </MenuItem>
              </ModalInviteRoom>
              <ModalConfirmation
                title={t('confirm_leave_room')}
                handleConfirmation={() => leaveRoom()}
              >
                <MenuItem>
                  <ListItemIcon>
                    <GroupRemoveIcon fontSize="small" />
                  </ListItemIcon>
                  {t('leave_room')}
                </MenuItem>
              </ModalConfirmation>
              <Divider className="mt--8 mb--8" />
            </>
          )}
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
        <MenuItem onClick={logout}>
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
