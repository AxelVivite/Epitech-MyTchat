/* eslint
mocha/no-top-level-hooks: 0
mocha/no-sibling-hooks: 0
*/

import assert from 'assert';

import { Notif } from '../../src/WsRegistry';

import { createRoom } from '../utils/room';
import { rndRegistersWithWs } from '../utils/websocket';

export default () => {
  it('Should notify users when a room is created with them in it', async () => {
    const users = await rndRegistersWithWs(5);
    after(() => users.forEach(({ ws }) => ws.close()));

    const roomIds = [];
    for (let i = 0; i < users.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const { data: { roomId } } = await createRoom(
        users[i].token,
        users
          .filter((_, j) => i !== j)
          .map(({ userId }) => userId),
      );
      roomIds.push(roomId);
    }

    users.forEach((user) => assert.equal(user.msgQueue.size(), users.length - 1));

    for (let i = 0; i < users.length; i += 1) {
      for (let j = 0; j < users.length - 1; j += 1) {
        const creatorIdx = j + (j >= i ? 1 : 0);
        const data = users[i].msgQueue.shift();

        assert.equal(data.type, Notif.RoomCreated);
        assert.equal(data.creatorId, users[creatorIdx].userId);
        assert.equal(data.roomId, roomIds[creatorIdx]);
      }
    }
  });
};
