import { setTimeout } from "timers/promises";
import assert from 'assert';
import * as mongoose from 'mongoose';
import WebSocket from 'ws'

import { Notif } from '../../src/WsRegistry';

import { url, makeId, arrayCmp } from '../utils/utils';
import { rndRegister, deleteUser } from '../utils/login';
import { createRoom, getRoom, invite, leave, postMsg, readMsg } from '../utils/room';
import { connectWs, wsNextNotif, wsMakeQueue } from '../utils/websocket';
import tokenAuth from '../auth/tokenAuth';
import postAuth from '../auth/postAuth';

export default () => {
  it('Should notify users when others delete their account, if they have a room in common', async () => {
    const users = await Promise.all([...new Array(5)].map(async () => {
      const { res: { data: { token, userId } } } = await rndRegister();
      const ws = await connectWs(token)
      const msgQueue = wsMakeQueue(ws)

      return { token, userId, ws, msgQueue };
    }));
    after(() => users.forEach(({ws}) => ws.close()));

    const { data: { roomId } } = await createRoom(users[0].token, users.slice(1).map(({userId}) => userId));

    users.forEach(({msgQueue}) => msgQueue.empty());

    await deleteUser(users[0].token);
    await deleteUser(users[1].token);

    for (let user of users.slice(2)) {
      assert.equal(user.msgQueue.size(), 2);
      const notif1 = user.msgQueue.shift();
      const notif2 = user.msgQueue.shift();

      assert.equal(notif1.type, Notif.UserLeftRoom);
      assert.equal(notif1.userId, users[0].userId);
      assert.equal(notif1.roomId, roomId);
      assert.equal(notif1.userDeleted, true);

      assert.equal(notif2.type, Notif.UserLeftRoom);
      assert.equal(notif2.userId, users[1].userId);
      assert.equal(notif2.roomId, roomId);
      assert.equal(notif2.userDeleted, true);
    }
  });

  it('Should notify users when others delete their account, if they have a room in common', async () => {
    const [user1, user2] = await Promise.all([...new Array(2)].map(async () => {
      const { res: { data: { token, userId } } } = await rndRegister();
      const ws = await connectWs(token)
      const msgQueue = wsMakeQueue(ws)

      return { token, userId, ws, msgQueue };
    }));
    after(() => [user1, user2].forEach(({ws}) => ws.close()));

    const { data: { roomId: roomId1 } } = await createRoom(user1.token, [user2.userId]);
    const { data: { roomId: roomId2 } } = await createRoom(user2.token, [user1.userId]);

    user1.msgQueue.empty();
    user2.msgQueue.empty();

    await deleteUser(user1.token);

    assert.equal(user2.msgQueue.size(), 2);

    const notif1 = user2.msgQueue.shift();
    const notif2 = user2.msgQueue.shift();

    assert.equal(notif1.type, Notif.UserLeftRoom);
    assert.equal(notif1.userId, user1.userId);
    assert.equal(notif1.userDeleted, true);

    assert.equal(notif2.type, Notif.UserLeftRoom);
    assert.equal(notif2.userId, user1.userId);
    assert.equal(notif2.userDeleted, true);

    // order doesn't matter
    assert(arrayCmp([notif1.roomId, notif2.roomId], [roomId1, roomId2]));
  });

  it('Should not notify others if they have no room in common', async () => {
    const [user1, user2] = await Promise.all([...new Array(2)].map(async () => {
      const { res: { data: { token, userId } } } = await rndRegister();
      const ws = await connectWs(token)
      const msgQueue = wsMakeQueue(ws)

      return { token, userId, ws, msgQueue };
    }));
    after(() => [user1, user2].forEach(({ws}) => ws.close()));

    const { data: { roomId: roomId1 } } = await createRoom(user1.token);
    const { data: { roomId: roomId2 } } = await createRoom(user2.token);

    user1.msgQueue.empty();
    user2.msgQueue.empty();

    await deleteUser(user1.token);

    assert.equal(user2.msgQueue.size(), 0);
  });

  it('Websocket connection should be closed when the account is deleted', async () => {
    const { res: { data: { token, userId } } } = await rndRegister();
    const ws = await connectWs(token)
    after(() => ws.close());

    await deleteUser(token);
    assert.equal(ws.readyState, WebSocket.CLOSED);
  });
};
