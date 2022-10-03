import assert from 'assert';
import * as mongoose from 'mongoose';

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

  // todo
  // it('Missing otherUsers', async () => {})
  // it('Invalid otherUsers', async () => {})
  // it('Empty otherUsers', async () => {})
  // it('Invalid otherUsers content', async () => {})
  // it('Some of the otherUsers not found', async () => {})
};
