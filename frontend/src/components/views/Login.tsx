import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';

import {
  Box,
  Button,
  Card,
  TextField,
} from '@mui/material';

import {
  User,
  Room,
} from '../../utils/globalStateManager/globalStateObjects';

import logo from '../../assets/logo.png';
import logoDark from '../../assets/logo-dark.png';
import Title from '../atoms/typography/Title';

import { login } from '../../utils/userManagment';
import { getRooms } from '../../utils/roomsManagment';
import { toastifyError } from '../../utils/toastify';

import { useGlobalState } from '../../utils/globalStateManager/globalStateInit';

const Login = function Login(): React.ReactElement<unknown, string> | null {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setState } = useGlobalState();

  const [username, setUsername] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');

  const setupGSM = React.useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (res: any, usernameToSet: string) => {
      const user: User = {
        userId: res?.data.userId,
        username: usernameToSet,
      };
      const rooms: Room[] | never[] | null = await getRooms(res?.data.token, user.userId);
      const activeRoom = rooms !== undefined && rooms !== null && rooms?.length > 0 ? rooms[0].roomId : '';
      const data = {
        user,
        rooms,
        token: res?.data.token,
        lang: 'fr',
        darkModeIsOn: false,
        websocket: undefined,
        activeRoom,
      };
      setState((prev) => ({ ...prev, ...data }));
    },
    [setState],
  );

  const handleSignin = async () => {
    try {
      const res = await login(username, password);
      if (res?.status === 200) {
        await setupGSM(res, username);
        navigate('/');
      }
    } catch (err: unknown) {
      const axiosErr = err as AxiosError;

      if (axiosErr && axiosErr.response) {
        const { status } = axiosErr.response;

        if (status === 400) {
          toastifyError(t('bad_request'));
        } else if (status === 401) {
          toastifyError(t('invalid_password'));
        } else if (status === 404) {
          toastifyError(t('no_user'));
        } else if (status === 410) {
          toastifyError(t('user_deleted'));
        } else {
          toastifyError(t('unknown_error'));
        }
      }
    }
  };

  React.useEffect(() => {
    if (localStorage.getItem('darkTheme') === 'true') {
      document.body.classList.add('dark-theme');
    }
  }, []);

  return (
    <Box>
      <Card className="col flex--center-align div--centered p--16">
        <Box className="row flex--center mb--24 mt--8">
          <img
            src={localStorage.getItem('darkTheme') === 'true' ? logo : logoDark}
            alt="logo"
            className="width--40 mr--16"
          />
          <Title className="my--auto" variant="header">
            MyTchat
          </Title>
        </Box>
        <TextField
          classes={{ root: 'mb--16 width--280' }}
          placeholder={t('username')}
          onChange={(event) => setUsername(event.target.value)}
          variant="outlined"
        />
        <TextField
          classes={{ root: 'mb--16 width--280' }}
          placeholder={t('password')}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          variant="outlined"
        />
        <Box className="row flex--center mt--8">
          <Button
            className="width--128 mr--8"
            type="button"
            variant="outlined"
            onClick={() => navigate('/sign-up')}
          >
            {t('sign_up')}
          </Button>
          <Button
            className="width--128 ml--8"
            type="button"
            variant="contained"
            onClick={handleSignin}
          >
            {t('sign_in')}
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default Login;
