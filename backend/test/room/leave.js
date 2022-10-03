import assert from 'assert';
import * as mongoose from 'mongoose';

import { url, arrayCmp } from '../utils/utils';
import { rndRegister } from '../utils/login';
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

  it('Leaves a room', async () => {
    const users = await Promise.all([...new Array(5)].map(async () => {
      const { res: { data: { token, userId } } } = await rndRegister();
      return { token, userId };
    }));

    const { data: { roomId } } = await createRoom(
      users[0].token,
      users.map(({ userId }) => userId),
    );

    await Promise.all([
      leave(users[0].token, roomId),
      leave(users[1].token, roomId),
    ]);

    const { data: { room } } = await getRoom(users[2].token, roomId, true);
    assert(arrayCmp(users.slice(2).map(({ userId }) => userId), room.users));
  });

  // todo
  // it('All user leave the room', async () => {})
};
