export const Notif = {
  NewPost: 'NewPost',
  RoomCreated: 'RoomCreated',
  RoomInvitation: 'RoomInvitation',
  NewUsersInRoom: 'NewUsersInRoom',
  UserLeftRoom: 'UserLeftRoom',
};

export function makePostNotif(userId, roomId, postId, content, createdAt) {
  return JSON.stringify({
    type: Notif.NewPost,
    userId,
    roomId,
    postId,
    content,
    createdAt,
  });
}

export function makeRoomCreatedNotif(creatorId, roomId) {
  return JSON.stringify({
    type: Notif.RoomCreated,
    creatorId,
    roomId,
  });
}

export function makeRoomInvitationNotif(userWhoInvited, roomId) {
  return JSON.stringify({
    type: Notif.RoomInvitation,
    userWhoInvited,
    roomId,
  });
}

export function makeNewUsersInRoomNotif(userWhoInvited, newUsers, roomId) {
  return JSON.stringify({
    type: Notif.NewUsersInRoom,
    userWhoInvited,
    newUsers,
    roomId,
  });
}

export function makeLeaveNotif(userId, roomId, userDeleted = false) {
  return JSON.stringify({
    type: Notif.UserLeftRoom,
    userId,
    roomId,
    userDeleted,
  });
}

// todo: handle multiple ws for the same user
export class WsRegistry {
  constructor() {
    this.ws = new Map();
    this.rooms = new Map();
  }

  getRoom(roomId) {
    if (!this.rooms.has(roomId)) {
      const room = new Set();

      this.rooms.set(roomId, room);
      return room;
    }

    return this.rooms.get(roomId);
  }

  addUserToRoom(roomId, userId) {
    this.getRoom(roomId).add(userId);
  }

  async send(userId, msg) {
    return this.ws.get(userId).send(msg);
  }

  userIsActive(userId) {
    return this.ws.has(userId);
  }

  connectUser(userId, ws, roomIds) {
    this.ws.set(userId, ws);
    roomIds.forEach((roomId) => this.addUserToRoom(roomId, userId));
  }

  disconnectUser(userId, roomIds) {
    this.ws.delete(userId);

    roomIds.forEach((roomId) => {
      const room = this.getRoom(roomId);
      room.delete(userId);

      if (room.size === 0) {
        this.rooms.delete(roomId);
      }
    });
  }

  async createRoom(creatorId, roomId, userIds) {
    const activeUsers = userIds.filter((userId) => this.userIsActive(userId));
    this.rooms.set(roomId, new Set(activeUsers));

    const notif = makeRoomCreatedNotif(creatorId, roomId);

    return Promise.all(
      activeUsers
        .filter((userId) => userId !== creatorId)
        .map((userId) => this.send(userId, notif)),
    );
  }

  async inviteRoom(userWhoInvited, roomId, userIds) {
    const room = this.getRoom(roomId);

    const oldUsers = [...room].filter((userId) => userId !== userWhoInvited);
    const newUsers = userIds.filter((userId) => this.userIsActive(userId));

    newUsers.forEach((userId) => room.add(userId));

    const notifOldUsers = makeNewUsersInRoomNotif(userWhoInvited, userIds, roomId);
    const notifNewUsers = makeRoomInvitationNotif(userWhoInvited, roomId);

    return Promise.all([
      ...oldUsers.map((userId) => this.send(userId, notifOldUsers)),
      ...newUsers.map((userId) => this.send(userId, notifNewUsers)),
    ]);
  }

  async leaveRoom(userId, roomId, userDeleted = false) {
    const room = this.getRoom(roomId);

    room.delete(userId);

    const notif = makeLeaveNotif(userId, roomId, userDeleted);

    if (room.size === 0) {
      this.rooms.delete(roomId);
    }

    return Promise.all(
      [...room].map((otherUserId) => this.send(otherUserId, notif)),
    );
  }

  async post(userId, roomId, postId, content, createdAt) {
    const room = this.getRoom(roomId);
    const notif = makePostNotif(userId, roomId, postId, content, createdAt);

    return Promise.all(
      [...room]
        .filter((userId2) => userId2 !== userId)
        .map((userId2) => this.send(userId2, notif)),
    );
  }

  async deleteUser(userId, roomIds) {
    if (!this.ws.has(userId)) {
      return;
    }

    this.ws.get(userId).close();
    this.ws.delete(userId);

    await Promise.all(
      roomIds.map((roomId) => {
        const room = this.getRoom(roomId);

        room.delete(userId);

        if (room.size === 0) {
          this.rooms.delete(roomId);
        }

        const notif = makeLeaveNotif(userId, roomId, true);

        return Promise.all(
          [...room].map((userId2) => this.send(userId2, notif)),
        );
      }),
    );
  }
}
