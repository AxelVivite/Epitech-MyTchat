import assert from 'assert';

import Errors from '../../src/errors';

import { url } from '../utils/utils';
import { rndRegister, getUserInfo, deleteUser } from '../utils/login';
import tokenAuth from '../auth/tokenAuth';

export default () => {
  const tokenAuthTests = tokenAuth({
    method: 'delete',
    url: `${url}/login/delete`,
  });

  describe('auth', tokenAuthTests);

  it('Should delete a user', async () => {
    const { token } = await rndRegister();

    const res = await deleteUser(token);

    assert.equal(res.status, 204);

    try {
      await getUserInfo(token);
    } catch (e) {
      assert.equal(e.response.status, 410);
      assert.equal(e.response.data.error, Errors.Login.UserIsDeleted);
    }
  });
};
