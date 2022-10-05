import {setTimeout} from "timers/promises";
import assert from 'assert';
import * as mongoose from 'mongoose';
import WebSocket from 'ws'

import { Notif } from '../../src/WsRegistry';

import { url, makeId, arrayCmp } from '../utils/utils';
import { rndRegister } from '../utils/login';
import { createRoom, getRoom, invite, postMsg, readMsg } from '../utils/room';
import { connectWs, wsNextNotif, wsMakeQueue } from '../utils/websocket';
import tokenAuth from '../auth/tokenAuth';
import postAuth from '../auth/postAuth';

export default () => {
  it('Should notify users when they are added to a room', async () => {
    const users = await Promise.all([...new Array(5)].map(async () => {
      const { res: { data: { token, userId } } } = await rndRegister();
      const ws = await connectWs(token)
      const msgQueue = wsMakeQueue(ws)

      return { token, userId, ws, msgQueue };
    }));
    after(() => users.forEach(({ws}) => ws.close()));

    const inviter = users[0];
    const initUsers = users.slice(1, 3);
    const invited = users.slice(3);

    const { data: { roomId } } = await createRoom(inviter.token, initUsers.map(({userId}) => userId));

    await invite(inviter.token, roomId, invited.map(({userId}) => userId));

    for (let user of invited) {
      assert.equal(user.msgQueue.size(), 1);
      const notif = user.msgQueue.shift();

      assert.equal(notif.type, Notif.RoomInvitation);
      assert.equal(notif.userWhoInvited, inviter.userId);
      assert.equal(notif.roomId, roomId);
    }
  });

  it('Should notify users when others are added to a room they are in', async () => {
    const users = await Promise.all([...new Array(5)].map(async () => {
      const { res: { data: { token, userId } } } = await rndRegister();
      const ws = await connectWs(token)
      const msgQueue = wsMakeQueue(ws)

      return { token, userId, ws, msgQueue };
    }));
    after(() => users.forEach(({ws}) => ws.close()));

    const inviter = users[0]
    const initUsers = users.slice(1, 3)
    const invited = users.slice(3)

    const { data: { roomId } } = await createRoom(inviter.token, initUsers.map(({userId}) => userId));

    initUsers.forEach(user => user.msgQueue.empty());

    await invite(inviter.token, roomId, invited.map(({userId}) => userId));

    for (let user of initUsers) {
      assert.equal(user.msgQueue.size(), 1);
      const notif = user.msgQueue.shift();

      assert.equal(notif.type, Notif.NewUsersInRoom);
      assert.equal(notif.userWhoInvited, inviter.userId);
      assert.equal(notif.roomId, roomId);
      assert(arrayCmp(notif.newUsers, invited.map(({userId}) => userId)));
    }
  });
};
