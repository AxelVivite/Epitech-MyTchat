import assert from 'assert';
import axios from 'axios';
import * as mongoose from 'mongoose';

import Errors from '../../src/errors';

import { url, arrayCmp } from '../utils/utils';
import { rndRegister } from '../utils/login';
import { createRoom, getRoom, invite } from '../utils/room';
import tokenAuth from '../auth/tokenAuth';
import roomAuth from '../auth/roomAuth';

export default () => {
  const tokenAuthTests = tokenAuth({
    method: 'post',
    url: `${url}/room/invite/${new mongoose.Types.ObjectId()}`,
    data: {
      otherUsers: [new mongoose.Types.ObjectId()],
    },
  });
  const roomAuthTests = roomAuth({
    method: 'post',
    url: `${url}/room/invite`,
    data: {
      otherUsers: [new mongoose.Types.ObjectId()],
    },
  });

  describe('auth', tokenAuthTests);
  describe('room auth', roomAuthTests);

  it('Should add user(s) to an existing room', async () => {
    const users = await Promise.all([...new Array(5)].map(async () => {
      const { res: { data: { token, userId } } } = await rndRegister();
      return { token, userId };
    }));

    const { data: { roomId } } = await createRoom(users[0].token, [users[1].userId]);
    await invite(users[0].token, roomId, users.slice(2).map(({ userId }) => userId));

    const { data: { room } } = await getRoom(users[0].token, roomId, true);
    assert(arrayCmp(users.map(({ userId }) => userId), room.users));
  });

  it('Missing other users', async () => {
    try {
      await axios({
        method: 'post',
        url: `${url}/room/invite/${new mongoose.Types.ObjectId()}`,
      });
    } catch (e) {
      assert.equal(e.response.status, 400);
      assert.equal(e.response.data.error, Errors.Room.BadOtherUsers);
      return;
    }

    throw new Error('Call should have failed');
  });

  it('Invalid other users (wrong type)', async () => {
    try {
      await axios({
        method: 'post',
        url: `${url}/room/invite/${new mongoose.Types.ObjectId()}`,
        data: {
          otherUsers: new mongoose.Types.ObjectId(),
        },
      });
    } catch (e) {
      assert.equal(e.response.status, 400);
      assert.equal(e.response.data.error, Errors.Room.BadOtherUsers);
      return;
    }

    throw new Error('Call should have failed');
  });

  it('Invalid other users (wrong userId type)', async () => {
    try {
      await axios({
        method: 'post',
        url: `${url}/room/invite/${new mongoose.Types.ObjectId()}`,
        data: {
          otherUsers: [1],
        },
      });
    } catch (e) {
      assert.equal(e.response.status, 400);
      assert.equal(e.response.data.error, Errors.BadId);
      return;
    }

    throw new Error('Call should have failed');
  });

  it('Invalid other users (wrong userId format)', async () => {
    try {
      await axios({
        method: 'post',
        url: `${url}/room/invite/${new mongoose.Types.ObjectId()}`,
        data: {
          otherUsers: ['a', 'b'],
        },
      });
    } catch (e) {
      assert.equal(e.response.status, 400);
      assert.equal(e.response.data.error, Errors.BadId);
      return;
    }

    throw new Error('Call should have failed');
  });

  it('Missing users', async () => {
    const users = await Promise.all([...new Array(5)].map(async () => {
      const { res: { data: { token, userId } } } = await rndRegister();
      return { token, userId };
    }));

    const { data: { roomId } } = await createRoom(users[0].token, [users[1].userId]);

    const fakeUsers = [
      new mongoose.Types.ObjectId(),
      new mongoose.Types.ObjectId(),
    ].map((id) => id.toString());

    try {
      await axios({
        method: 'post',
        url: `${url}/room/invite/${roomId}`,
        headers: {
          authorization: `Bearer ${users[0].token}`,
        },
        data: {
          otherUsers: [
            ...users.slice(2).map(({ userId }) => userId),
            ...fakeUsers,
          ],
        },
      });
    } catch (e) {
      assert.equal(e.response.status, 404);
      assert.equal(e.response.data.error, Errors.Login.AccountNotFound);
      assert(arrayCmp(e.response.data.missingUsers, fakeUsers));
      return;
    }

    throw new Error('Call should have failed');
  });
};
