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
import roomAuth from '../auth/roomAuth';

export default () => {
  const tokenAuthTests = tokenAuth({
    method: 'post',
    url: `${url}/room/post/${new mongoose.Types.ObjectId()}`,
    data: {
      content: makeId(),
    },
  });
  const roomAuthTests = roomAuth({
    method: 'post',
    url: `${url}/room/post`,
    data: {
      content: makeId(),
    },
  });

  describe('auth', tokenAuthTests);
  describe('room auth', roomAuthTests);

  // todo: test createdAt and updatedAt
  it('Posts a message to a room', async () => {
    const { res: { data: { token, userId } } } = await rndRegister();

    const { data: { roomId } } = await createRoom(token);

    const content1 = makeId();
    const content2 = makeId();

    const { data: { postId: postId1 } } = await postMsg(token, roomId, content1);
    const { data: { postId: postId2 } } = await postMsg(token, roomId, content2);

    const { data: { room } } = await getRoom(token, roomId, true);
    assert.equal(room.posts[0], postId1);
    assert.equal(room.posts[1], postId2);

    const { data: { post } } = await readMsg(token, postId1);
    assert.equal(post.user, userId);
    assert.equal(post.room, roomId);
    assert.equal(post.content, content1);
  });

  // todo
  // it('missing content', async () => {})
  // it('invalid content', async () => {})
};
