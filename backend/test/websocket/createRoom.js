import {setTimeout} from "timers/promises";
import assert from 'assert';
import * as mongoose from 'mongoose';
import WebSocket from 'ws'

import { Notif } from '../../src/WsRegistry';

import { url, makeId } from '../utils/utils';
import { rndRegister } from '../utils/login';
import { createRoom, getRoom, postMsg, readMsg } from '../utils/room';
import { connectWs, wsNextNotif, wsMakeQueue } from '../utils/websocket';
import tokenAuth from '../auth/tokenAuth';
import postAuth from '../auth/postAuth';

export default () => {
  it('Should notify users when a room is created with them in it', async () => {
    const users = await Promise.all([...new Array(5)].map(async () => {
      const { res: { data: { token, userId } } } = await rndRegister();
      const ws = await connectWs(token)
      const msgQueue = wsMakeQueue(ws)

      return { token, userId, ws, msgQueue };
    }));
    after(() => users.forEach(({ws}) => ws.close()));

    const roomIds = []
    for (let i = 0; i < users.length; i++) {
      const { data: { roomId } } = await createRoom(
        users[i].token,
        users
          .filter((_, j) => i !== j)
          .map(({userId}) => userId),
        );
      roomIds.push(roomId);
    }

    users.forEach(user => assert.equal(user.msgQueue.size(), users.length - 1));

    for (let i = 0; i < users.length; i++) {
      for (let j = 0; j < users.length - 1; j++) {
        const creatorIdx = j + (j >= i ? 1 : 0);
        const data = users[i].msgQueue.shift()

        assert.equal(data.type, Notif.RoomCreated);
        assert.equal(data.creatorId, users[creatorIdx].userId);
        assert.equal(data.roomId, roomIds[creatorIdx]);
      }
    }
  });
};
