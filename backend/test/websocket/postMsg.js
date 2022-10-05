/* eslint
mocha/no-top-level-hooks: 0
mocha/no-sibling-hooks: 0
*/

import assert from 'assert';

import { Notif } from '../../src/WsRegistry';

import { makeId } from '../utils/utils';
import { rndRegisters } from '../utils/login';
import { createRoom, postMsg, readMsg } from '../utils/room';
import { connectWs, wsNextNotif, rndRegistersWithWs } from '../utils/websocket';

export default () => {
  it('Should notify users in room when someone posts', async () => {
    const [user1, user2] = await rndRegisters(2);
    const { data: { roomId } } = await createRoom(user1.token, [user2.userId]);

    const ws = await connectWs(user2.token);
    after(() => ws.close());
    const nextNotif = wsNextNotif(ws);

    const msg = makeId();
    await postMsg(user1.token, roomId, msg);

    const data = await nextNotif;

    assert.equal(data.type, Notif.NewPost);
    assert.equal(data.userId, user1.userId);
    assert.equal(data.roomId, roomId);
    assert.equal(data.content, msg);
    assert.notEqual(Date.parse(data.createdAt), NaN);

    const { data: { post } } = await readMsg(user2.token, data.postId);
    assert.equal(post.createdAt, data.createdAt);
  });

  it('Many users / no notifications to the one who posted / many messages', async () => {
    const users = await rndRegistersWithWs(5);
    after(() => users.forEach(({ ws }) => ws.close()));

    const { data: { roomId } } = await createRoom(
      users[0].token,
      users.slice(1).map(({ userId }) => userId),
    );

    // remove RoomCreated notifs
    users
      .filter((user) => user.msgQueue.size() > 0)
      .forEach((user) => user.msgQueue.empty());

    const msgs = [];
    for (let i = 0; i < users.length; i += 1) {
      const msg = makeId();
      msgs.push(msg);
      // eslint-disable-next-line no-await-in-loop
      await postMsg(users[i].token, roomId, msg);
    }

    users.forEach((user) => assert.equal(user.msgQueue.size(), users.length - 1));

    for (let i = 0; i < users.length; i += 1) {
      for (let j = 0; j < users.length - 1; j += 1) {
        const posterIdx = j + (j >= i ? 1 : 0);
        const data = users[i].msgQueue.shift();

        assert.equal(data.type, Notif.NewPost);
        assert.equal(data.userId, users[posterIdx].userId);
        assert.equal(data.content, msgs[posterIdx]);
      }
    }
  });
};
