/* eslint
mocha/no-top-level-hooks: 0
mocha/no-sibling-hooks: 0
*/

import assert from 'assert';

import { Notif } from '../../src/WsRegistry';

import { createRoom, leave } from '../utils/room';
import { rndRegistersWithWs } from '../utils/websocket';

export default () => {
  it('Should notify users when others are leaving a room they are in', async () => {
    const users = await rndRegistersWithWs(5);
    after(() => users.forEach(({ ws }) => ws.close()));

    const { data: { roomId } } = await createRoom(
      users[0].token,
      users.slice(1).map(({ userId }) => userId),
    );

    users.forEach(({ msgQueue }) => msgQueue.empty());

    await leave(users[0].token, roomId);
    await leave(users[1].token, roomId);

    users.slice(2).forEach((user) => {
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
    });
  });
};
