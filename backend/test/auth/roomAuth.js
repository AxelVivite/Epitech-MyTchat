import assert from 'assert';
import axios from 'axios';
import * as mongoose from 'mongoose';

import Errors from '../../src/errors';

import { rndRegister } from '../utils/login';
import { createRoom } from '../utils/room';

export default (baseReq) => {
  const req = {
    ...baseReq,
    headers: {
      ...baseReq.headers,
    },
  };

  // eslint-disable-next-line mocha/no-top-level-hooks
  before(async () => {
    const { res: { data: { token } } } = await rndRegister();

    req.headers = { ...req.headers, authorization: `Bearer ${token}` };
  });

  return () => {
    it('Invalid room Id', async () => {
      req.url = `${baseReq.url}/a`;

      try {
        await axios(req);
      } catch (e) {
        assert.equal(e.response.status, 400);
        assert.equal(e.response.data.error, Errors.BadId);
        return;
      }

      throw new Error('Call should have failed');
    });

    it('Room not found', async () => {
      req.url = `${baseReq.url}/${new mongoose.Types.ObjectId()}`;

      try {
        await axios(req);
      } catch (e) {
        assert.equal(e.response.status, 404);
        assert.equal(e.response.data.error, Errors.Room.RoomNotFound);
        return;
      }

      throw new Error('Call should have failed');
    });

    it('User not in room', async () => {
      const { res: { data: { token } } } = await rndRegister();
      const { data: { roomId } } = await createRoom(token);

      req.url = `${baseReq.url}/${roomId}`;

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
