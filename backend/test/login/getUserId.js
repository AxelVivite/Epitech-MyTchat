import assert from 'assert';

import { makeId, makeEmail, makePwd } from '../utils/utils';
import { register, getUserId } from '../utils/login';

export default () => {
  it('Should get a userId from a username', async () => {
    const username = makeId();
    const { data: { userId: userId1 } } = await register(username, makeEmail(), makePwd());

    const { data: { userId: userId2 } } = await getUserId(username);

    assert.equal(userId1, userId2);
  });

  // todo
  // it('User not found', async () => {})
  // it('User was deleted', async () => {})
};
