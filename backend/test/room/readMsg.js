import assert from 'assert';
import * as mongoose from 'mongoose';

import { url, makeId } from '../utils/utils';
import { rndRegister } from '../utils/login';
import {
  createRoom,
  getRoom,
  postMsg,
  readMsg,
} from '../utils/room';
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

  // todo: test createdAt and updatedAt
  it('Should get a post', async () => {
    const { res: { data: { token, userId } } } = await rndRegister();
    const { data: { roomId } } = await createRoom(token);

    const content = makeId();
    const { data: { postId } } = await postMsg(token, roomId, content);

    const { data: { room } } = await getRoom(token, roomId, true);
    assert.equal(room.posts[0], postId);

    const { data: { post } } = await readMsg(token, postId);
    assert.equal(post.user, userId);
    assert.equal(post.room, roomId);
    assert.equal(post.content, content);
  });
};
