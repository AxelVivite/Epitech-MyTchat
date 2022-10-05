import assert from 'assert';
import * as mongoose from 'mongoose';

import Errors from '../../src/errors';

import { url, arrayCmp } from '../utils/utils';
import { rndRegisters } from '../utils/login';
import { createRoom, getRoom, leave } from '../utils/room';
import tokenAuth from '../auth/tokenAuth';
import roomAuth from '../auth/roomAuth';

export default () => {
  const tokenAuthTests = tokenAuth({
    method: 'post',
    url: `${url}/room/leave/${new mongoose.Types.ObjectId()}`,
  });
  const roomAuthTests = roomAuth({
    method: 'post',
    url: `${url}/room/leave`,
  });

  describe('auth', tokenAuthTests);
  describe('room auth', roomAuthTests);

  it('Should leave a room', async () => {
    const users = await rndRegisters(5);

    const { data: { roomId } } = await createRoom(
      users[0].token,
      users.map(({ userId }) => userId),
    );

    await Promise.all([
      leave(users[0].token, roomId),
      leave(users[1].token, roomId),
    ]);

    const { data: { room } } = await getRoom(users[2].token, roomId);
    assert(arrayCmp(users.slice(2).map(({ userId }) => userId), room.users));

    try {
      await getRoom(users[0].token, roomId);
    } catch (e) {
      assert.equal(e.response.status, 401);
      assert.equal(e.response.data.error, Errors.Room.NotInRoom);
      return;
    }

    throw new Error('Call should have failed');
  });

  it('Should leave a room empty', async () => {
    const users = await rndRegisters(3);

    const { data: { roomId } } = await createRoom(
      users[0].token,
      users.map(({ userId }) => userId),
    );

    await Promise.all(users.map(({ token }) => leave(token, roomId)));

    try {
      await getRoom(users[0].token, roomId);
    } catch (e) {
      assert.equal(e.response.status, 401);
      assert.equal(e.response.data.error, Errors.Room.NotInRoom);
      return;
    }

    throw new Error('Call should have failed');
  });
};
