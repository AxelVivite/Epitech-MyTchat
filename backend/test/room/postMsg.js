import assert from 'assert';
import axios from 'axios';
import * as mongoose from 'mongoose';

import Errors from '../../src/errors';

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

  it('Should post a message to a room', async () => {
    const { token, userId } = await rndRegister();
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

  it('Should create a timestamp', async () => {
    const t1 = new Date();

    const { token } = await rndRegister();
    const { data: { roomId } } = await createRoom(token);

    const { data: { postId } } = await postMsg(token, roomId, makeId());
    const { data: { post } } = await readMsg(token, postId);

    const t2 = new Date();
    const createdAt = new Date(post.createdAt);

    assert.equal(post.createdAt, post.updatedAt);
    assert(createdAt >= t1);
    assert(createdAt <= t2);
  });

  it('Content missing', async () => {
    try {
      await axios({
        method: 'post',
        url: `${url}/room/post/${new mongoose.Types.ObjectId()}`,
      });
    } catch (e) {
      assert.equal(e.response.status, 400);
      assert.equal(e.response.data.error, Errors.Room.BadPostContent);
      return;
    }

    throw new Error('Call should have failed');
  });

  it('Invalid content (wrong type)', async () => {
    try {
      await axios({
        method: 'post',
        url: `${url}/room/post/${new mongoose.Types.ObjectId()}`,
        data: {
          content: 10,
        },
      });
    } catch (e) {
      assert.equal(e.response.status, 400);
      assert.equal(e.response.data.error, Errors.Room.BadPostContent);
      return;
    }

    throw new Error('Call should have failed');
  });

  it('Invalid content (empty)', async () => {
    try {
      await axios({
        method: 'post',
        url: `${url}/room/post/${new mongoose.Types.ObjectId()}`,
        data: {
          content: '',
        },
      });
    } catch (e) {
      assert.equal(e.response.status, 400);
      assert.equal(e.response.data.error, Errors.Room.BadPostContent);
      return;
    }

    throw new Error('Call should have failed');
  });
};
