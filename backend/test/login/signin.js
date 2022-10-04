import assert from 'assert';
import axios from 'axios';

import Errors from '../../src/errors';

import { url, makeId, makePwd } from '../utils/utils';
import {
  rndRegister,
  signin,
  getUserInfo,
  deleteUser,
} from '../utils/login';

export default () => {
  it('Should get a token for the user', async () => {
    const {
      username: username1,
      email: email1,
      pwd,
    } = await rndRegister();

    const { data: { token } } = await signin(username1, pwd);

    const {
      data: {
        user: {
          username: username2,
          email: email2,
          rooms,
        },
      },
    } = await getUserInfo(token);

    assert.equal(username1, username2);
    assert.equal(email1, email2);
    assert(rooms.length === 0);
  });

  it('User not found', async () => {
    try {
      await signin(makeId(), makePwd());
    } catch (e) {
      assert.equal(e.response.status, 404);
      assert.equal(e.response.data.error, Errors.Login.AccountNotFound);
      return;
    }

    throw new Error('Call should have failed');
  });

  it('User was deleted', async () => {
    const {
      username,
      pwd,
      res: { data: { token } },
    } = await rndRegister();

    await deleteUser(token);

    try {
      await signin(username, pwd);
    } catch (e) {
      assert.equal(e.response.status, 410);
      assert.equal(e.response.data.error, Errors.Login.UserIsDeleted);
      return;
    }

    throw new Error('Call should have failed');
  });

  it('Missing auth', async () => {
    const { username } = await rndRegister();

    try {
      await axios({
        method: 'get',
        url: `${url}/login/signin/${username}`,
      });
    } catch (e) {
      assert.equal(e.response.status, 401);
      assert.equal(e.response.data.error, Errors.Login.MissingAuth);
      return;
    }

    throw new Error('Call should have failed');
  });

  it('Bad auth type', async () => {
    const {
      username,
      res: { data: { token } },
    } = await rndRegister();

    try {
      await axios({
        method: 'get',
        url: `${url}/login/signin/${username}`,
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
    } catch (e) {
      assert.equal(e.response.status, 400);
      assert.equal(e.response.data.error, Errors.Login.BadAuthType);
      return;
    }

    throw new Error('Call should have failed');
  });

  it('Invalid password', async () => {
    const { username } = await rndRegister();

    try {
      await axios({
        method: 'get',
        url: `${url}/login/signin/${username}`,
        headers: {
          authorization: `Basic ${makePwd()}`,
        },
      });
    } catch (e) {
      assert.equal(e.response.status, 401);
      assert.equal(e.response.data.error, Errors.Login.InvalidPassword);
      return;
    }

    throw new Error('Call should have failed');
  });
};
