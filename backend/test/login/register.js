import assert from 'assert';
import axios from 'axios';
import { Types } from 'mongoose';

import Errors from '../../src/errors';

import {
  url,
  makeId,
  makeEmail,
  makePwd,
} from '../utils/utils';
import { rndRegister, register, getUserInfo } from '../utils/login';

export default () => {
  it('Should create a user and return a token', async () => {
    const username = makeId();
    const email = makeEmail();
    const pwd = makePwd();
    const { data: { userId, token, expiresIn }, status } = await register(username, email, pwd);

    assert.equal(status, 201);
    assert(Types.ObjectId.isValid(userId));
    assert(typeof expiresIn === 'string');

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
    assert(rooms.length === 0);
  });

  it('Username missing', async () => {
    try {
      await axios({
        method: 'post',
        url: `${url}/login/register`,
        data: {
          email: makeEmail(),
          password: makePwd(),
        },
      });
    } catch (e) {
      assert.equal(e.response.status, 400);
      assert.equal(e.response.data.error, Errors.Registration.BadUsername);
      return;
    }

    throw new Error('Call should have failed');
  });

  it('Username taken', async () => {
    const { username } = await rndRegister();

    try {
      await register(username, makeEmail(), makePwd());
    } catch (e) {
      assert.equal(e.response.status, 409);
      assert.equal(e.response.data.error, Errors.Registration.UsernameTaken);
      return;
    }

    throw new Error('Call should have failed');
  });

  it('Email missing', async () => {
    try {
      await axios({
        method: 'post',
        url: `${url}/login/register`,
        data: {
          username: makeId(),
          password: makePwd(),
        },
      });
    } catch (e) {
      assert.equal(e.response.status, 400);
      assert.equal(e.response.data.error, Errors.Registration.BadEmail);
      return;
    }

    throw new Error('Call should have failed');
  });

  // todo: more bad emails
  it('Email invalid', async () => {
    try {
      await register(makeId(), 'a', makePwd());
    } catch (e) {
      assert.equal(e.response.status, 400);
      assert.equal(e.response.data.error, Errors.Registration.BadEmail);
      return;
    }

    throw new Error('Call should have failed');
  });

  it('Email taken', async () => {
    const { email } = await rndRegister();

    try {
      await register(makeId(), email, makePwd());
    } catch (e) {
      assert.equal(e.response.status, 409);
      assert.equal(e.response.data.error, Errors.Registration.EmailTaken);
      return;
    }

    throw new Error('Call should have failed');
  });

  it('Password missing', async () => {
    try {
      await axios({
        method: 'post',
        url: `${url}/login/register`,
        data: {
          username: makeId(),
          email: makeEmail(),
        },
      });
    } catch (e) {
      assert.equal(e.response.status, 400);
      assert.equal(e.response.data.error, Errors.Registration.BadPassword);
      return;
    }

    throw new Error('Call should have failed');
  });

  it('Password invalid', async () => {
    const badPwds = ['a', 'qwertyu', 'qwerqwe51qwe1', 'AkasdAUYasdA', 'asA78'];

    await Promise.all(badPwds.map(async (pwd) => {
      try {
        await register(makeId(), makeEmail(), pwd);
      } catch (e) {
        assert.equal(e.response.status, 400);
        assert.equal(e.response.data.error, Errors.Registration.BadPassword);
        return;
      }

      throw new Error(`Call should have failed: pwd = ${pwd}`);
    }));
  });

  // todo
  // it('The username is invalid', async () => {})
};
