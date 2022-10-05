import assert from 'assert';
import * as mongoose from 'mongoose';

import Errors from '../../src/errors';

import { rndRegister, getUsername } from '../utils/login';

export default () => {
  it('Should get a username from a userId', async () => {
    const { username: username1, userId } = await rndRegister();
    const { data: { username: username2 } } = await getUsername(userId);

    assert.equal(username1, username2);
  });

  it('User not found', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    try {
      await getUsername(fakeId);
    } catch (e) {
      assert.equal(e.response.status, 404);
      assert.equal(e.response.data.error, Errors.Login.AccountNotFound);
      return;
    }

    throw new Error('Call should have failed');
  });

  it('Bad user Id', async () => {
    const fakeId = 'a';

    try {
      await getUsername(fakeId);
    } catch (e) {
      assert.equal(e.response.status, 400);
      assert.equal(e.response.data.error, Errors.BadId);
      return;
    }

    throw new Error('Call should have failed');
  });
};
