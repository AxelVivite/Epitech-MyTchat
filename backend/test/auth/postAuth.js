import assert from 'assert';
import axios from 'axios';
import * as mongoose from 'mongoose';

import Errors from '../../src/errors';

import { makeId } from '../utils/utils';
import { rndRegister } from '../utils/login';
import { createRoom, postMsg } from '../utils/room';

export default (baseReq) => {
  const req = {
    ...baseReq,
    headers: {
      ...baseReq.headers,
    },
  };

  // eslint-disable-next-line mocha/no-top-level-hooks
  before(async () => {
    const { token } = await rndRegister();

    req.headers = { ...req.headers, authorization: `Bearer ${token}` };
  });

  return () => {
    it('Invalid post Id', async () => {
      req.url = `${req.url}/a`;

      try {
        await axios(req);
      } catch (e) {
        assert.equal(e.response.status, 400);
        assert.equal(e.response.data.error, Errors.BadId);
        return;
      }

      throw new Error('Call should have failed');
    });

    it('Post not found', async () => {
      req.url = `${baseReq.url}/${new mongoose.Types.ObjectId()}`;

      try {
        await axios(req);
      } catch (e) {
        assert.equal(e.response.status, 404);
        assert.equal(e.response.data.error, Errors.Room.PostNotFound);
        return;
      }

      throw new Error('Call should have failed');
    });

    it('User not in room where it was posted', async () => {
      const { token } = await rndRegister();
      const { data: { roomId } } = await createRoom(token);

      const { data: { postId } } = await postMsg(token, roomId, makeId());

      req.url = `${baseReq.url}/${postId}`;

      try {
        await axios(req);
      } catch (e) {
        assert.equal(e.response.status, 401);
        assert.equal(e.response.data.error, Errors.Room.NotInRoom);
        return;
      }

      throw new Error('Call should have failed');
    });
  };
};
