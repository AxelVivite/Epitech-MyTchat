/* eslint no-underscore-dangle: 0 */ // --> OFF

import url from 'url';

import express from 'express';
import expressWs from 'express-ws';
import { body as checkBody } from 'express-validator';
import jwt from 'jsonwebtoken';

import Errors from '../errors';
import {
  SECRET,
  checkToken,
  checkUserExists,
  getUser,
  getRoom,
  validateArgs,
} from './middlewares';
import User from '../models/user';
import Room from '../models/room';
import Post from '../models/post';

const roomRouter = express.Router();
expressWs(roomRouter);

// todo: make route(s) so you don't load all messages at once

/**
 * @openapi
 * /room/create:
 *   post:
 *     tags:
 *       - room
 *     description: Create a new room
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otherUsers
 *             properties:
 *               otherUsers:
 *                 type: array
 *                 description: >-
 *                   Other users (besides the one calling the route) to give access to the route
 *                 items:
 *                   $ref: '#/components/schemas/MongoId'
 *     responses:
 *       400:
 *         description: >-
 *           Bad request, details are returned, can be because of:
 *           MissingToken, BadAuthType (ex: Basic instead of Bearer)
 *       401:
 *         description: Bad token (not created by this server or expired)
 *       404:
 *         description: Any of the user are not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - error
 *                 - missingUsers
 *               properties:
 *                 error:
 *                   type: string
 *                 missingUsers:
 *                   type: array
 *                   description: Users that could not be found
 *                   items:
 *                     $ref: '#/components/schemas/MongoId'
 *       200:
 *         description: Returns the id of the room that was created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - roomId
 *               properties:
 *                 roomId:
 *                   $ref: '#/components/schemas/MongoId'
 */
roomRouter.post(
  '/create',
  [
    checkToken,
    checkBody('otherUsers').default([]).isArray().withMessage(Errors.Room.BadOtherUsers),
    checkBody('otherUsers.*').isString().withMessage((value) => ({
      error: Errors.Room.BadOtherUsers,
      value,
    })),
    validateArgs,
  ],
  async (req, res) => {
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
      user.rooms.push(room._id);
      return user.save();
    }));

    return res.status(200).json({
      roomId: room._id,
    });
  },
);

/**
 * @openapi
 * /room/info/{roomId}:
 *   get:
 *     tags:
 *       - room
 *     description: Get info on a room
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/MongoId'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       400:
 *         description: >-
 *           Bad request, details are returned, can be because of:
 *           MissingToken, BadAuthType (ex: Basic instead of Bearer)
 *       401:
 *         description: >-
 *           Bad token (not created by this server or expired)
 *           or user doesn't have access to the room
 *       404:
 *         description: The user or the room was not found
 *       200:
 *         description: Returns info on the room
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - users
 *                 - posts
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MongoId'
 *                 posts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MongoId'
 */
roomRouter.get('/info/:roomId', [checkToken, checkUserExists, getRoom], async (req, res) => {
  res.status(200).json({
    room: {
      users: req.state.room.users,
      posts: req.state.room.posts,
    },
  });
});

// todo: get all messages in the room
roomRouter.get('/read', async (req, res) => {
  res.status(200);
});

// todo: maybe replace with a leave route, remove when room has no more users
/**
 * @openapi
 * /room/delete/{roomId}:
 *   delete:
 *     tags:
 *       - room
 *     description: Delete a room
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/MongoId'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       400:
 *         description: >-
 *           Bad request, details are returned, can be because of:
 *           MissingToken, BadAuthType (ex: Basic instead of Bearer)
 *       401:
 *         description: >-
 *           Bad token (not created by this server or expired)
 *           or user doesn't have access to the room
 *       404:
 *         description: The user or the room was not found
 *       200:
 *         description: Returns info on the room
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - users
 *                 - posts
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MongoId'
 *                 posts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MongoId'
 */
roomRouter.delete('/delete/:roomId', [checkToken, getUser], async (req, res) => {
  if (!req.state.user.rooms.includes(req.params.roomId)) {
    return res.status(401).json({
      error: Errors.Room.NotInRoom,
    });
  }

  const room = await Room.findByIdAndRemove(req.params.roomId);

  // todo: if this is true this means the User data is corrupted since it says the user is
  // in a room that doesn't exist. Internal error ? Correct User data ?
  if (room === null) {
    return res.status(404).json({
      error: Errors.Room.RoomNotFound,
    });
  }

  await Promise.all(room.posts.map((postId) => Post.findByIdAndRemove(postId)));

  return res.status(200).json({
    room: {
      users: room.users,
      posts: room.posts,
    },
  });
});

// todo: implement ticket based auth ?
// -> (https://devcenter.heroku.com/articles/websocket-security#authentication-authorization)
// todo: more logging, at least in dev mode
// todo: logger doesn't detect this route
// todo: internalError middleware doesn't work with this route
// todo: openapi comment
roomRouter.ws('/websocket', async (ws, req) => {
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

  ws.on('message', async (data) => {
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
  });

  ws.on('close', async () => {
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
  });

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
});

// todo: rework this route work like the ws
// todo: openapi comment
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
