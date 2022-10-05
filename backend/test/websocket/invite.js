/* eslint
mocha/no-top-level-hooks: 0
mocha/no-sibling-hooks: 0
*/

import assert from 'assert';

import { Notif } from '../../src/WsRegistry';

import { arrayCmp } from '../utils/utils';
import { createRoom, invite } from '../utils/room';
import { rndRegistersWithWs } from '../utils/websocket';

export default () => {
  it('Should notify users when they are added to a room', async () => {
    const users = await rndRegistersWithWs(5);
    after(() => users.forEach(({ ws }) => ws.close()));

    const inviter = users[0];
    const initUsers = users.slice(1, 3);
    const invited = users.slice(3);

    const { data: { roomId } } = await createRoom(
      inviter.token,
      initUsers.map(({ userId }) => userId),
    );

    await invite(inviter.token, roomId, invited.map(({ userId }) => userId));

    invited.forEach((user) => {
      assert.equal(user.msgQueue.size(), 1);
      const notif = user.msgQueue.shift();

      assert.equal(notif.type, Notif.RoomInvitation);
      assert.equal(notif.userWhoInvited, inviter.userId);
      assert.equal(notif.roomId, roomId);
    });
  });

  it('Should notify users when others are added to a room they are in', async () => {
    const users = await rndRegistersWithWs(5);
    after(() => users.forEach(({ ws }) => ws.close()));

    const inviter = users[0];
    const initUsers = users.slice(1, 3);
    const invited = users.slice(3);

    const { data: { roomId } } = await createRoom(
      inviter.token,
      initUsers.map(({ userId }) => userId),
    );

    initUsers.forEach((user) => user.msgQueue.empty());

    await invite(inviter.token, roomId, invited.map(({ userId }) => userId));

    initUsers.forEach((user) => {
      assert.equal(user.msgQueue.size(), 1);
      const notif = user.msgQueue.shift();

      assert.equal(notif.type, Notif.NewUsersInRoom);
      assert.equal(notif.userWhoInvited, inviter.userId);
      assert.equal(notif.roomId, roomId);
      assert(arrayCmp(notif.newUsers, invited.map(({ userId }) => userId)));
    });
  });
};
