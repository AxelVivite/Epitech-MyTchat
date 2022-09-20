/* eslint no-underscore-dangle: 0 */ // --> OFF

import url from 'url';

import express from 'express';
import expressWs from 'express-ws';
import jwt from 'jsonwebtoken';

import Errors from '../errors';
import { SECRET, checkToken, checkUserExists } from './middlewares';
import User from '../models/user';
import Room from '../models/room';
import Post from '../models/post';

const roomRouter = express.Router();
expressWs(roomRouter)

// todo: remove this function
roomRouter.get('/rooms', async (req, res) => {
  const rooms = await Room.find({});

  res.status(200).json(rooms.map(({ _id }) => _id));
});

roomRouter.get('/info/:roomId', [checkToken, checkUserExists], async (req, res) => {
  const room = await Room.findById({ _id: req.params.roomId });
  // todo: check user is in room

  if (room === null) {
    return res.status(404).json({
      error: Errors.Room.NotFound,
    });
  }

  if (!room.users.includes(req.state.userId)) {
    return res.status(401).json({
      error: Errors.Room.NotInRoon,
    });
  }

  return res.status(200).json({
    room: {
      users: room.users,
      posts: room.posts,
    },
  });
});

roomRouter.post('/create', [checkToken], async (req, res) => {
  // check req.body.otherUsers presence and type
  const userIds = [...new Set([req.state.userId, ...req.body.otherUsers])];
  const users = await User.find({ _id: { $in: userIds } });

  if (userIds.length > users.length) {
    const missingUsers = userIds.filter((userId) => users.some(({ _id }) => userId === _id));

    return res.status(404).json({
      // todo: maybe use a more appropriate error type
      error: Errors.Login.AccountNotFound,
      missingUsers,
    });
  }

  const room = new Room({
    users,
  });

  await room.save();

  await Promise.all(users.map((user) => {
    user.rooms.push(room._id)
    return user.save()
  }))

  return res.status(200).json({
    roomId: room._id,
  });
});

// todo
roomRouter.get('/read', async (req, res) => {
  res.status(200);
});

// todo: maybe replace with a leave route, remove when room has no more users
roomRouter.delete('/delete/:roomId', [checkToken, checkUserExists], async (req, res) => {
  // todo: check roomId param
  // todo: check room exists
  // todo: check user is in room
  const room = await Room.findByIdAndRemove(({ _id: req.params.roomId }));

  await Promise.all(room.posts.map((postId) => Post.findByIdAndRemove({ _id: postId })));

  res.status(200).send();
});

// todo: implement ticket based auth ? (https://devcenter.heroku.com/articles/websocket-security#authentication-authorization)
// todo: more logging, at least in dev mode
// todo: logger doesn't detect this route
roomRouter.ws('/websocket', async (ws, req) => {
  // todo: check token is there
  const token = url.parse(req.url, true).query.token
  let userId

  try {
    userId = jwt.verify(token, SECRET).userId;
  } catch (e) {
    ws.send(Errors.Login.BadToken, _err => {
      ws.close();
    });
    console.error(e)
    return;
  }

  ws.on('message', async (data) => {
    // todo: check data
    const { roomId, content } = JSON.parse(data);

    // todo: check room exists
    const room = await Room.findById({ _id: roomId });

    const post = new Post({
      user: userId,
      content: content,
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

    for (let userId2 of activeUsers) {
      if (userId2 === userId) {
        continue;
      }

      const wsUser = req.app.locals.ws.get(userId2)

      wsUser.send(JSON.stringify({
        roomId,
        postId: post._id,
      }));
    }
  });

  ws.on('close', async (event) => {
    req.app.locals.ws.delete(userId)

    // todo: check user still exists
    const user = await User.findById({ _id: userId })

    for (let roomId of user.rooms) {
      const activeUsers = req.app.locals.roomActiveUsers.get(roomId.toString())
      activeUsers.delete(userId)

      if (activeUsers.size === 0) {
        req.app.locals.roomActiveUsers.delete(roomId.toString())
      }
    }
  });

  // todo: check user exists
  const user = await User.findById({ _id: userId })

  // todo: handle multiple ws for same user
  req.app.locals.ws.set(userId, ws)

  for (let roomId of user.rooms) {
    if (!req.app.locals.roomActiveUsers.has(roomId.toString())) {
      req.app.locals.roomActiveUsers.set(roomId.toString(), new Set())
    }

    const roomActiveUsers = req.app.locals.roomActiveUsers.get(roomId.toString())
    roomActiveUsers.add(userId)
  }

  // todo
  // ws.on('error', (err) => {});
});

// todo: rework this route work like the ws
roomRouter.post('/post/:roomId', [checkToken, checkUserExists], async (req, res) => {
  // todo: check roomId param
  // todo: check room exists
  // todo: check user is in room
  const room = await Room.findById({ _id: req.params.roomId });

  const post = new Post({
    user: req.state.userId,
    content: req.body.content,
  });
  room.posts.push(post._id);

  await Promise.all(
    post.save(),
    room.save(),
  );

  // todo: use websocket to notify users

  res.status(200).json({
    post: post._id,
  });
});

// todo
roomRouter.get('/read', async (req, res) => {
  res.status(200);
});

export default roomRouter;
