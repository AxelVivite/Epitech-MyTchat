import assert from 'assert';
import * as mongoose from 'mongoose';

import { url, makeId } from '../utils/utils';
import { rndRegister } from '../utils/login';
import { createRoom, postMsg, readMsg } from '../utils/room';
import tokenAuth from '../auth/tokenAuth';
import postAuth from '../auth/postAuth';

export default () => {
  const tokenAuthTests = tokenAuth({
    method: 'get',
    url: `${url}/room/read/${new mongoose.Types.ObjectId()}`,
  });
  const postAuthTests = postAuth({
    method: 'get',
    url: `${url}/room/read`,
  });

  describe('auth', tokenAuthTests);
  describe('post auth', postAuthTests);

  it('Should get a post', async () => {
    const { res: { data: { token, userId } } } = await rndRegister();
    const { data: { roomId } } = await createRoom(token);

    const content = makeId();
    const { data: { postId } } = await postMsg(token, roomId, content);
    const { data: { post } } = await readMsg(token, postId);

    assert.equal(post.user, userId);
    assert.equal(post.room, roomId);
    assert.equal(post.content, content);
    assert.notEqual(Date.parse(post.createdAt), NaN);
    assert.notEqual(Date.parse(post.updatedAt), NaN);
  });
};
