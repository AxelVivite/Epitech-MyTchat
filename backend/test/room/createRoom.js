import assert from 'assert';

import {
  url,
  makeId,
  arrayCmp,
} from '../utils/utils';
import { rndRegister } from '../utils/login';
import { createRoom, getRoom } from '../utils/room';
import tokenAuth from '../auth/tokenAuth';

export default () => {
  const tokenAuthTests = tokenAuth({
    method: 'post',
    url: `${url}/room/create`,
  });

  describe('auth', tokenAuthTests);

  it('Should create a new room', async () => {
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

  // todo
  // it('Should have default name', async () => {});
  // it('Missing other users', async () => {});
  // it('Invalid other users', async () => {});
  // it('Invalid other users content', async () => {});
  // it('Some users missing', async () => {});
};
