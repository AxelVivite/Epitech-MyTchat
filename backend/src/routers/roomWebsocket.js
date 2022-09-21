/* eslint no-console: 0 */ // --> OFF
/* eslint no-underscore-dangle: 0 */ // --> OFF

import url from 'url';

import jwt from 'jsonwebtoken';
import chalk from 'chalk';

import Errors from '../errors';
import { SECRET } from './middlewares';
import User from '../models/user';
import Room from '../models/room';
import Post from '../models/post';

function logger(req) {
  console.log(`[${req.ws._socket.remoteAddress}] ${chalk.green('WS')} ${chalk.red('/room/websocket')} - ${(new Date()).toUTCString()}`);
}

async function onMessage(ws, req, userId, data) {
  // todo: check data
  const { roomId, content } = JSON.parse(data);

  // todo: check room exists
  const room = await Room.findById({ _id: roomId });

  const post = new Post({
    user: userId,
    content,
  });
  room.posts.push(post._id);

  await Promise.all([
    post.save(),
    room.save(),
  ]);

  if (!req.app.locals.roomActiveUsers.has(roomId)) {
    return;
  }

  const activeUsers = req.app.locals.roomActiveUsers.get(roomId);

  activeUsers.forEach((userId2) => {
    if (userId2 === userId) {
      return;
    }

    const wsUser = req.app.locals.ws.get(userId2);

    wsUser.send(JSON.stringify({
      roomId,
      postId: post._id,
    }));
  });
}

async function onClose(ws, req, userId) {
  req.app.locals.ws.delete(userId);

  // todo: check user still exists
  const user = await User.findById({ _id: userId });

  user.rooms.forEach((roomId) => {
    const activeUsers = req.app.locals.roomActiveUsers.get(roomId.toString());
    activeUsers.delete(userId);

    if (activeUsers.size === 0) {
      req.app.locals.roomActiveUsers.delete(roomId.toString());
    }
  });
}

export default async function roomWebsocket(ws, req) {
  try {
    logger(req);

    // todo: check token is there
    const { query: { token } } = url.parse(req.url, true);
    let userId;

    try {
      userId = jwt.verify(token, SECRET).userId;
    } catch (e) {
      ws.send(Errors.Login.BadToken, () => {
        ws.close();
      });
      return;
    }

    ws.on('message', (data) => onMessage(ws, req, userId, data).catch((err) => console.error(err)));
    ws.on('close', () => onClose(ws, req, userId).catch((err) => console.error(err)));

    // todo: check user exists
    const user = await User.findById({ _id: userId });

    // todo: handle multiple ws for same user
    req.app.locals.ws.set(userId, ws);

    user.rooms.forEach((roomId) => {
      if (!req.app.locals.roomActiveUsers.has(roomId.toString())) {
        req.app.locals.roomActiveUsers.set(roomId.toString(), new Set());
      }

      const roomActiveUsers = req.app.locals.roomActiveUsers.get(roomId.toString());
      roomActiveUsers.add(userId);
    });

    // todo
    // ws.on('error', (err) => {});
  } catch (err) {
    console.error(err);
  }
}
