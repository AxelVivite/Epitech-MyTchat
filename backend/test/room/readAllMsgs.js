import assert from 'assert';
import * as mongoose from 'mongoose';

import { url, makeId } from '../utils/utils';
import { rndRegister } from '../utils/login';
import {
  createRoom,
  getRoom,
  postMsg,
  readMsg,
  readAllMsgs,
} from '../utils/room';
import tokenAuth from '../auth/tokenAuth';
import roomAuth from '../auth/roomAuth';

export default () => {
  const tokenAuthTests = tokenAuth({
    method: 'get',
    url: `${url}/room/readAll/${new mongoose.Types.ObjectId()}`,
  });
  const roomAuthTests = roomAuth({
    method: 'get',
    url: `${url}/room/readAll`,
  });

  describe('auth', tokenAuthTests);
  describe('room auth', roomAuthTests);

  it('Should get all posts in a room', async () => {
    const { token } = await rndRegister();
    const { data: { roomId } } = await createRoom(token);

    await Promise.all([...new Array(5)].map(() => postMsg(token, roomId, makeId())));

    const { data: { room } } = await getRoom(token, roomId);
    const { data: { posts } } = await readAllMsgs(token, roomId);

    assert.equal(room.posts.length, posts.length);

    await Promise.all(room.posts.map(async (postId) => {
      const { data: { post: post1 } } = await readMsg(token, postId);

      // Order of posts is not guaranted when so close together
      const post2 = posts.find((post) => post.id === postId);
      assert.notEqual(post2, undefined);

      assert.equal(postId, post2.id);
      assert.equal(post1.user, post2.user);
      assert.equal(post1.room, post2.room);
      assert.equal(post1.content, post2.content);
      assert.equal(post1.createdAt, post2.createdAt);
      assert.equal(post1.updatedAt, post2.updatedAt);
    }));
  });
};
