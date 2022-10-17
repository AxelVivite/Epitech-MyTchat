import assert from 'assert';
import axios from 'axios';
import * as mongoose from 'mongoose';

import Errors from '../../src/errors';

import {
  url,
  makeId,
  arrayCmp,
} from '../utils/utils';
import { rndRegister, rndRegisters } from '../utils/login';
import { createRoom, getRoom } from '../utils/room';
import tokenAuth from '../auth/tokenAuth';

export default () => {
  const tokenAuthTests = tokenAuth({
    method: 'post',
    url: `${url}/room/create`,
  });

  describe('auth', tokenAuthTests);

  it('Should create a new room', async () => {
    const users = await rndRegisters(5);

    const name = makeId();

    const { data: { roomId } } = await createRoom(
      users[0].token,
      users.slice(1).map(({ userId }) => userId),
      name,
    );
    const { data: { room } } = await getRoom(users[0].token, roomId, true);

    assert(arrayCmp(users.map(({ userId }) => userId), room.users));
    assert.equal(name, room.name);
  });

  it('Should create a timestamp', async () => {
    const t1 = new Date();

    const { token } = await rndRegister();
    const { data: { roomId } } = await createRoom(token);
    const { data: { room } } = await getRoom(token, roomId);

    const t2 = new Date();
    const createdAt = new Date(room.createdAt);

    assert.equal(room.createdAt, room.updatedAt);
    assert(createdAt >= t1);
    assert(createdAt <= t2);
  });

  it('Should create a room with a default name', async () => {
    const users = await rndRegisters(5);

    const { data: { roomId } } = await createRoom(
      users[0].token,
      users.slice(1).map(({ userId }) => userId),
    );
    const { data: { room } } = await getRoom(users[0].token, roomId, true);

    assert.equal(typeof room.name, 'string');
    assert(room.name.length > 0);
  });

  it('Invalid name (wrong type)', async () => {
    const { token } = await rndRegister();

    try {
      await axios({
        method: 'post',
        url: `${url}/room/create/`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        data: {
          name: 10,
        },
      });
    } catch (e) {
      assert.equal(e.response.status, 400);
      assert.equal(e.response.data.error, Errors.Room.BadRoomName);
      return;
    }

    throw new Error('Call should have failed');
  });

  it('Other users should default to []', async () => {
    const { token, userId } = await rndRegister();

    const { data: { roomId } } = await createRoom(token);
    const { data: { room } } = await getRoom(token, roomId, true);

    assert.equal(room.users.length, 1);
    assert.equal(room.users[0], userId);
  });

  it('Invalid other users (wrong type)', async () => {
    try {
      await axios({
        method: 'post',
        url: `${url}/room/create/`,
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
        url: `${url}/room/create/`,
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
        url: `${url}/room/create/`,
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
    const users = await rndRegisters(3);

    const fakeUsers = [
      new mongoose.Types.ObjectId(),
      new mongoose.Types.ObjectId(),
    ].map((id) => id.toString());

    try {
      await axios({
        method: 'post',
        url: `${url}/room/create/`,
        headers: {
          authorization: `Bearer ${users[0].token}`,
        },
        data: {
          otherUsers: [
            ...users.map(({ userId }) => userId),
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
