import { setTimeout } from "timers/promises";
import assert from 'assert';
import * as mongoose from 'mongoose';
import WebSocket from 'ws'

import { Notif } from '../../src/WsRegistry';

import { url, makeId, arrayCmp } from '../utils/utils';
import { rndRegister } from '../utils/login';
import { createRoom, getRoom, invite, leave, postMsg, readMsg } from '../utils/room';
import { connectWs, wsNextNotif, wsMakeQueue } from '../utils/websocket';
import tokenAuth from '../auth/tokenAuth';
import postAuth from '../auth/postAuth';

export default () => {
  it('Should notify users when others are leaving a room they are in', async () => {
    const users = await Promise.all([...new Array(5)].map(async () => {
      const { res: { data: { token, userId } } } = await rndRegister();
      const ws = await connectWs(token)
      const msgQueue = wsMakeQueue(ws)

      return { token, userId, ws, msgQueue };
    }));
    after(() => users.forEach(({ws}) => ws.close()));

    const { data: { roomId } } = await createRoom(users[0].token, users.slice(1).map(({userId}) => userId));

    users.forEach(({msgQueue}) => msgQueue.empty());

    await leave(users[0].token, roomId);
    await leave(users[1].token, roomId);

    for (let user of users.slice(2)) {
      assert.equal(user.msgQueue.size(), 2);
      const notif1 = user.msgQueue.shift();
      const notif2 = user.msgQueue.shift();

      assert.equal(notif1.type, Notif.UserLeftRoom);
      assert.equal(notif1.userId, users[0].userId);
      assert.equal(notif1.roomId, roomId);
      assert.equal(notif1.userDeleted, false);

      assert.equal(notif2.type, Notif.UserLeftRoom);
      assert.equal(notif2.userId, users[1].userId);
      assert.equal(notif2.roomId, roomId);
      assert.equal(notif2.userDeleted, false);
    }
  });
};
