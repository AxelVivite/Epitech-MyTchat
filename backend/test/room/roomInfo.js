import assert from 'assert';
import * as mongoose from 'mongoose';

import {
  url,
  makeId,
  arrayCmp,
} from '../utils/utils';
import { rndRegister, rndRegisters } from '../utils/login';
import { createRoom, getRoom, postMsg } from '../utils/room';
import tokenAuth from '../auth/tokenAuth';
import roomAuth from '../auth/roomAuth';

export default () => {
  const tokenAuthTests = tokenAuth({
    method: 'get',
    url: `${url}/room/info/${new mongoose.Types.ObjectId()}`,
  });
  const roomAuthTests = roomAuth({
    method: 'get',
    url: `${url}/room/info`,
  });

  describe('auth', tokenAuthTests);
  describe('room auth', roomAuthTests);

  it('Should get info on a room', async () => {
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

  it('Should optionally return the last post', async () => {
    const { token: token1 } = await rndRegister();
    const { token: token2, userId: userId2 } = await rndRegister();

    const { data: { roomId } } = await createRoom(token1, [userId2]);

    const content = makeId();

    await postMsg(token1, roomId, makeId());
    const { data: { postId } } = await postMsg(token2, roomId, content);

    const { data: { room } } = await getRoom(token1, roomId, true);

    assert.equal(room.lastPost.id, postId);
    assert.equal(room.lastPost.user, userId2);
    assert.equal(room.lastPost.room, roomId);
    assert.equal(room.lastPost.content, content);
    assert.notEqual(Date.parse(room.lastPost.createdAt), NaN);
    assert.notEqual(Date.parse(room.lastPost.updatedAt), NaN);
  });
};
