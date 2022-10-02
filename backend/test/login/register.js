import assert from 'assert';
import { Types } from 'mongoose';

import { makeId, makeEmail, makePwd } from '../utils/utils';
import { register, getUserInfo } from '../utils/login';

export default () => {
  it('Should create a user and return a token', async () => {
    const username = makeId();
    const email = makeEmail();
    const pwd = makePwd();
    const { data: { userId, token, expiresIn } } = await register(username, email, pwd);

    assert(Types.ObjectId.isValid(userId));
    assert(typeof expiresIn === 'string');

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
  // it('The username is missing or invalid', async () => {})
  // it('The email is missing or invalid', async () => {})
  // it('The password is missing or invalid', async () => {})
  // it('The username is already taken', async () => {})
  // it('The email is already taken', async () => {})
};
