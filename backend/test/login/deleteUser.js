import assert from 'assert';

import Errors from '../../src/errors';

import { makeId, makeEmail, makePwd } from '../utils/utils';
import { register, getUserInfo, deleteUser } from '../utils/login';

export default () => {
  it('Should delete a user', async () => {
    const { data: { token } } = await register(makeId(), makeEmail(), makePwd());

    await deleteUser(token);

    try {
      await getUserInfo(token);
    } catch (e) {
      assert.equal(e.response.status, 410, 'Error code');
      assert.equal(e.response.data.error, Errors.Login.UserIsDeleted, 'Error string');
    }
  });

  // todo
  // it('Missing auth', async function() {})
  // it('Bad auth type', async function() {})
  // it('Token is invalid', async function() {})
  // it('Bad user Id', async function() {})
  // it('User not found', async function() {})
  // it('User was deleted', async function() {})
};
