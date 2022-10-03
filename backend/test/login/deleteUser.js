import assert from 'assert';
import axios from 'axios';
import jwt from 'jsonwebtoken';

import Errors from '../../src/errors';

import { url, makeId } from '../utils/utils';
import { rndRegister, getUserInfo, deleteUser } from '../utils/login';

export default () => {
  it('Should delete a user', async () => {
    const { res: { data: { token } } } = await rndRegister();

    await deleteUser(token);

    try {
      await getUserInfo(token);
    } catch (e) {
      assert.equal(e.response.status, 410);
      assert.equal(e.response.data.error, Errors.Login.UserIsDeleted);
    }
  });

  it('User was deleted', async () => {
    const { res: { data: { token } } } = await rndRegister();

    await deleteUser(token);

    try {
      await deleteUser(token);
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
        method: 'delete',
        url: `${url}/login/delete`,
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
        method: 'delete',
        url: `${url}/login/delete`,
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
        method: 'delete',
        url: `${url}/login/delete`,
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
  // it('Bad user Id', async function() {})
  // it('User not found', async function() {})
};
