import assert from 'assert';

import {
  url,
  makeId,
  makeEmail,
  makePwd,
} from '../utils/utils';
import { register, getUserInfo } from '../utils/login';
import tokenAuth from '../auth/tokenAuth';

export default () => {
  const tokenAuthTests = tokenAuth({
    method: 'get',
    url: `${url}/login/info`,
  });

  describe('auth', tokenAuthTests);

  it('Should get info on a user', async () => {
    const username = makeId();
    const email = makeEmail();
    const pwd = makePwd();
    const { data: { token } } = await register(username, email, pwd);

    const {
      data: {
        user: {
          username: username2,
          email: email2,
          rooms,
        },
      },
    } = await getUserInfo(token);

    assert.equal(username, username2);
    assert.equal(email, email2);
    assert.equal(0, rooms.length);
  });
};
