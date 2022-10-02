import assert from 'assert';

import { makeId, makeEmail, makePwd } from '../utils/utils';
import { register, getUsername } from '../utils/login';

export default () => {
  it('Should get a username from a userId', async () => {
    const username1 = makeId();
    const { data: { userId } } = await register(username1, makeEmail(), makePwd());

    const { data: { username: username2 } } = await getUsername(userId);

    assert.equal(username1, username2);
  });

  // todo
  // it('User not found', async () => {})
  // it('User was deleted', async () => {})
  // it('Bad user Id', async () => {})
};
