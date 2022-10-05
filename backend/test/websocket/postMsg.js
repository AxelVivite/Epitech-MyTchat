import assert from 'assert';

import { Notif } from '../../src/WsRegistry';

import { makeId } from '../utils/utils';
import { rndRegister } from '../utils/login';
import { createRoom, postMsg, readMsg } from '../utils/room';
import { connectWs, wsNextNotif, wsMakeQueue } from '../utils/websocket';

export default () => {
  it('Should notify users in room when someone posts', async () => {
    const { res: { data: { token: token1, userId: userId1 } } } = await rndRegister();
    const { res: { data: { token: token2, userId: userId2 } } } = await rndRegister();
    const { data: { roomId } } = await createRoom(token1, [userId2]);

    const ws = await connectWs(token2);
    after(() => ws.close());
    const nextNotif = wsNextNotif(ws);

    const msg = makeId();
    await postMsg(token1, roomId, msg);

    const data = await nextNotif;

    assert.equal(data.type, Notif.NewPost);
    assert.equal(data.userId, userId1);
    assert.equal(data.roomId, roomId);
    assert.equal(data.content, msg);
    assert.notEqual(Date.parse(data.createdAt), NaN);

    const { data: { post } } = await readMsg(token2, data.postId);
    assert.equal(post.createdAt, data.createdAt);
  });

  it('Many users / no notifications to the one who posted / many messages', async () => {
    const users = await Promise.all([...new Array(5)].map(async () => {
      const { res: { data: { token, userId } } } = await rndRegister();
      const ws = await connectWs(token);
      const msgQueue = wsMakeQueue(ws);

      return {
        token,
        userId,
        ws,
        msgQueue,
      };
    }));
    after(() => users.forEach(({ws}) => ws.close()));

    const { data: { roomId } } = await createRoom(users[0].token, users.slice(1).map(({userId}) => userId));

    // remove RoomCreated notifs
    users
      .filter(user => user.msgQueue.size() > 0)
      .forEach(user => user.msgQueue.empty());

    const msgs = []
    for (let i = 0; i < users.length; i++) {
      const msg = makeId();
      msgs.push(msg);
      await postMsg(users[i].token, roomId, msg);
    }

    users.forEach(user => assert.equal(user.msgQueue.size(), users.length - 1));

    for (let i = 0; i < users.length; i++) {
      for (let j = 0; j < users.length - 1; j++) {
        const posterIdx = j + (j >= i ? 1 : 0);
        const data = users[i].msgQueue.shift();

        assert.equal(data.type, Notif.NewPost);
        assert.equal(data.userId, users[posterIdx].userId);
        assert.equal(data.content, msgs[posterIdx]);
      }
    }
  });
};
