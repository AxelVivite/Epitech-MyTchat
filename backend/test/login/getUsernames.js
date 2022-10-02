import assert from 'assert';

import { makeId, makeEmail, makePwd } from '../utils/utils';
import { register, getUsernames } from '../utils/login';

export default () => {
  it('Should return all user names', async () => {
    const username1 = makeId();
    const username2 = makeId();

    await Promise.all([
      register(username1, makeEmail(), makePwd()),
      register(username2, makeEmail(), makePwd()),
    ]);

    const { data: { users } } = await getUsernames();

    assert(users.includes(username1));
    assert(users.includes(username2));
  });
};
