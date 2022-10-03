import assert from 'assert';
import * as mongoose from 'mongoose';

import {
  url,
  makeId,
  arrayCmp,
} from '../utils/utils';
import { rndRegister } from '../utils/login';
import { createRoom, getRoom } from '../utils/room';
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
    const users = await Promise.all([...new Array(5)].map(async () => {
      const { res: { data: { token, userId } } } = await rndRegister();
      return { token, userId };
    }));

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
};
