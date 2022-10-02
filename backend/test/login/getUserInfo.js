import assert from 'assert';

import { makeId, makeEmail, makePwd } from '../utils/utils';
import { register, getUserInfo } from '../utils/login';

export default () => {
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
    assert(rooms.length === 0);
  });

  // todo
  // it('Missing auth', async () => {})
  // it('Bad auth type', async () => {})
  // it('Token is invalid', async () => {})
  // it('Bad user Id', async () => {})
  // it('User not found', async () => {})
  // it('User was deleted', async () => {})
};
