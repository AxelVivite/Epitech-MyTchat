import assert from 'assert';
import axios from 'axios';
import jwt from 'jsonwebtoken';

import Errors from '../../src/errors';

import { makeId } from '../utils/utils';
import { rndRegister, deleteUser } from '../utils/login';

export default (baseReq) => {
  const req = {
    ...baseReq,
    headers: {
      ...baseReq.headers,
    },
  };

  return () => {
    it('User was deleted', async () => {
      const { token } = await rndRegister();

      await deleteUser(token);

      req.headers.authorization = `Bearer ${token}`;

      try {
        await axios(req);
      } catch (e) {
        assert.equal(e.response.data.error, Errors.Login.UserIsDeleted);
        assert.equal(e.response.status, 410);
        return;
      }

      throw new Error('Call should have failed');
    });

    it('Missing auth', async () => {
      delete req.headers.authorization;

      try {
        await axios(req);
      } catch (e) {
        assert.equal(e.response.status, 401);
        assert.equal(e.response.data.error, Errors.Login.MissingAuth);
        return;
      }

      throw new Error('Call should have failed');
    });

    it('Bad auth type', async () => {
      const { pwd } = await rndRegister();

      req.headers.authorization = `Basic ${pwd}`;

      try {
        await axios(req);
      } catch (e) {
        assert.equal(e.response.status, 400);
        assert.equal(e.response.data.error, Errors.Login.BadAuthType);
        return;
      }

      throw new Error('Call should have failed');
    });

    // todo: test token expired
    it('Invalid token', async () => {
      const { userId } = await rndRegister();

      const token = jwt.sign(
        { userId },
        makeId(),
        { expiresIn: '1h' },
      );

      req.headers.authorization = `Bearer ${token}`;

      try {
        await axios(req);
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
};
