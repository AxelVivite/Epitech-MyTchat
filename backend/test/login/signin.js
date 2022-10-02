import assert from 'assert';

import { makeId, makeEmail, makePwd } from '../utils/utils';
import { register, signin, getUserInfo } from '../utils/login';

export default () => {
  it('Should get a token for the user', async () => {
    const username1 = makeId();
    const email1 = makeEmail();
    const pwd = makePwd();

    await register(username1, email1, pwd);
    const { data: { token } } = await signin(username1, pwd);

    const {
      data: {
        user: {
          username: username2,
          email: email2,
          rooms,
        },
      },
    } = await getUserInfo(token);

    assert.equal(username1, username2);
    assert.equal(email1, email2);
    assert(rooms.length === 0);
  });

  // todo
  // it('User not found', async () => {})
  // it('User was deleted', async () => {})
  // it('Bad user Id', async () => {})
  // it('Missing auth', async () => {})
  // it('Bad auth type', async () => {})
  // it('Invalid password', async () => {})
};
