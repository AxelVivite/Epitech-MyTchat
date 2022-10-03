import assert from 'assert';
import axios from 'axios';
import jwt from 'jsonwebtoken';

import Errors from '../../src/errors';

import {
  url,
  makeId,
  makeEmail,
  makePwd,
} from '../utils/utils';
import {
  rndRegister,
  register,
  getUserInfo,
  deleteUser,
} from '../utils/login';

export default () => {
  it('Should get info on a user', async () => {
    const username = makeId();
    const email = makeEmail();
    const pwd = makePwd();
    const { data: { token } } = await register(username, email, pwd);

    const {
      data: {
        user: {
          username: username2,
          email: email2,
          rooms,
        },
      },
    } = await getUserInfo(token);

    assert.equal(username, username2);
    assert.equal(email, email2);
    assert.equal(0, rooms.length);
  });

  it('User was deleted', async () => {
    const { res: { data: { token } } } = await rndRegister();

    await deleteUser(token);

    try {
      await getUserInfo(token);
    } catch (e) {
      assert.equal(e.response.status, 410);
      assert.equal(e.response.data.error, Errors.Login.UserIsDeleted);
      return;
    }

    throw new Error('Call should have failed');
  });

  it('Missing auth', async () => {
    try {
      await axios({
        method: 'get',
        url: `${url}/login/info`,
      });
    } catch (e) {
      assert.equal(e.response.status, 401);
      assert.equal(e.response.data.error, Errors.Login.MissingAuth);
      return;
    }

    throw new Error('Call should have failed');
  });

  it('Bad auth type', async () => {
    const { pwd } = await rndRegister();

    try {
      await axios({
        method: 'get',
        url: `${url}/login/info`,
        headers: {
          authorization: `Basic ${pwd}`,
        },
      });
    } catch (e) {
      assert.equal(e.response.status, 400);
      assert.equal(e.response.data.error, Errors.Login.BadAuthType);
      return;
    }

    throw new Error('Call should have failed');
  });

  it('Invalid token', async () => {
    const { res: { data: { userId } } } = await rndRegister();

    const token = jwt.sign(
      { userId },
      makeId(),
      { expiresIn: '1h' },
    );

    try {
      await axios({
        method: 'get',
        url: `${url}/login/info`,
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
    } catch (e) {
      assert.equal(e.response.status, 401);
      assert.equal(e.response.data.error, Errors.Login.BadToken);
      return;
    }

    throw new Error('Call should have failed');
  });

  // todo
  // it('Bad user Id', async () => {})
  // it('User not found', async () => {})
};
