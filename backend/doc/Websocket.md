# Websockets

This API uses websockets to send notifications to a client about a variety of things.

## Connection

The connection endpoint is ```ws://{url}/room/websocket```, it requires a token in the query for authentication.

Simple connection example using [ws](https://www.npmjs.com/package/ws):
```js
import WebSocket from 'ws';

const token = // get token

const ws = new WebSocket(`ws://localhost:3000/room/websocket?token=${token}`);

ws.on('open', () => {
  console.log('Websocket connected');
});

ws.on('close', (event) => {
  if (event.wasClean) {
    console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
  } else {
    console.log('[close] Connection died');
  }
});

ws.on('error', (error) => {
  console.log(`[error] ${error.message}`);
});

ws.on('message', (data) => {
  const notif = JSON.parse(data);

  console.log(notif);
});
```

### Connection errors

If an error occurs during connection an error code will be sent on the websocket and the connection will be closed as soon as it is transmitted.

Those errors include:
- No token in the query ('MissingToken')
- The token is invalid ('BadToken')
- The user has been deleted ('UserIsDeleted')

## Notifications

At the moment, we have 5 notifications:
- NewPost
- RoomCreated
- RoomInvitation
- NewUsersInRoom
- UserLeftRoom

Note that the user who initiated the action will not get a notification.

All the notifications are in json.

### NewPost

Someone posted in a room you are in (eg. ```/room/post/{roomId}```).

Its type is:
```js
{
  type: 'NewPost',
  userId: UserId,
  roomId: RoomId,
  postId: PostId,
  content: String,
  createdAt: String, // with the format '2017-07-21T17:32:28Z'
}
```

### RoomCreated

Someone created a room with you in it (eg. ```/room/create/```).

Its type is:
```js
{
  type: 'RoomCreated',
  creatorId: UserId,
  roomId: RoomId,
}
```

### RoomInvitation

Someone added you to an existing room (eg. ```/room/invite/{roomId}```).

Its type is:
```js
{
  type: 'RoomInvitation',
  userWhoInvited: UserId,
  roomId: RoomId,
}
```

### NewUsersInRoom

Someone added some other people to a room you are in (eg. ```/room/invite/{roomId}```).

Its type is:
```js
{
  type: 'NewUsersInRoom',
  userWhoInvited: UserId,
  newUsers: [UserId],
  roomId: RoomId,
}
```

### UserLeftRoom

Someone left a room you are in (eg. ```/room/invite/{roomId}``` or ```/login/delete```).

If a user is deleted they will leave all the rooms they are in, there will be 1 notification by room.

Its type is:
```js
{
  type: 'UserLeftRoom',
  userId: UserId,
  roomId: RoomId,
  userDeleted: Boolean, // Will be true if the user deleted their account
}
```
