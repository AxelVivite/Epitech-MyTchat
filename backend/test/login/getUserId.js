import assert from 'assert';

import Errors from '../../src/errors';

import { makeId } from '../utils/utils';
import { rndRegister, getUserId } from '../utils/login';

export default () => {
  it('Should get a userId from a username', async () => {
    const { username, userId: userId1 } = await rndRegister();
    const { data: { userId: userId2 } } = await getUserId(username);

    assert.equal(userId1, userId2);
  });

  it('User not found', async () => {
    try {
      await getUserId(makeId());
    } catch (e) {
      assert.equal(e.response.status, 404);
      assert.equal(e.response.data.error, Errors.Login.AccountNotFound);
      return;
    }

    throw new Error('Call should have failed');
  });
};
