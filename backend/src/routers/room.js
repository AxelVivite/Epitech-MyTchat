/* eslint no-underscore-dangle: 0 */ // --> OFF

import express from 'express';
import expressWs from 'express-ws';
import { body as checkBody } from 'express-validator';

import Errors from '../errors';
import {
  checkToken,
  checkUserExists,
  getUser,
  getRoom,
  getPost,
  validateArgs,
} from './middlewares';
import User from '../models/user';
import Room from '../models/room';
import Post from '../models/post';
import roomWebsocket from './roomWebsocket';

const roomRouter = express.Router();
expressWs(roomRouter);

// todo: make route(s) so you don't load all messages at once

// todo: maybe don't use ids to give other users (or give other ways)
// todo: add query flag to continue even if some users are invalid
// todo: use ws to notify users
// todo: update roomActiveUsers
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
 *               name:
 *                 type: string
 *                 format: string
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
 *         description: Some of the users were not found
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
 *       410:
 *         description: User has been deleted
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
    getUser,
    checkBody('otherUsers').default([]).isArray().withMessage(Errors.Room.BadOtherUsers),
    checkBody('otherUsers.*').isString().withMessage((value) => ({
      error: Errors.Room.BadOtherUsers,
      value,
    })),
    validateArgs,
  ],
  async (req, res) => {
    const userIds = [...new Set([req.state.userId, ...req.body.otherUsers])];
    const users = await User.find({ _id: { $in: userIds }, isDeleted: false });

    if (userIds.length > users.length) {
      const missingUsers = userIds.filter((userId) => users.some(({ _id }) => userId === _id));

      return res.status(404).json({
        // todo: maybe use a more appropriate error type
        error: Errors.Login.AccountNotFound,
        missingUsers,
      });
    }

    let roomName = req.body.name;

    if (roomName === undefined || roomName === '') {
      roomName = users.map(({ username }) => username).join(', ');
    }

    const room = new Room({
      name: roomName,
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

// todo: update openapi doc with getLastPost
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
 *       - in: query
 *         name: getLastPost
 *         schema:
 *           type: boolean
 *         description: If present, the last post in the room will be returned
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
 *       410:
 *         description: User has been deleted
 *       200:
 *         description: Returns info on the room
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - name
 *                 - users
 *                 - posts
 *               properties:
 *                 name:
 *                   type: string
 *                   format: string
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MongoId'
 *                 posts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MongoId'
 *                 lastPost:
 *                   $ref: '#/components/schemas/Post'
 */
roomRouter.get('/info/:roomId', [
  checkToken,
  checkUserExists,
  getRoom,
], async (req, res) => {
  const data = {
    room: {
      name: req.state.room.name,
      users: req.state.room.users,
      posts: req.state.room.posts,
    },
  };

  if (req.query.getLastPost === 'true' || req.query.getLastPost === '') {
    if (data.room.posts.length === 0) {
      data.room.lastPost = null;
    } else {
      const post = await Post.findById(data.room.posts[data.room.posts.length - 1]);

      data.room.lastPost = {
        user: post.user,
        room: post.room,
        content: post.content,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      };
    }
  }

  res.status(200).json(data);
});

// todo: get all messages in the room
roomRouter.get('/read', async (req, res) => {
  res.status(200);
});

// todo: add query flag to continue even if some users are invalid
// todo: test this more throughly
// todo: openapi jsdoc
/**
 * @openapi
 * /room/invite/{roomId}:
 *   post:
 *     tags:
 *       - room
 *     description: Invite users to a room
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/MongoId'
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otherUsers
 *             properties:
 *               name:
 *                 type: string
 *                 format: string
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
 *           MissingToken, BadAuthType, badOtherUsers (ex: Basic instead of Bearer)
 *       401:
 *         description: Bad token (not created by this server or expired)
 *       404:
 *         description: Some of the users were not found
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
 *       410:
 *         description: User has been deleted
 *       201:
 *         description: The other users were added successfully
 */
roomRouter.post(
  '/invite/:roomId',
  [
    checkBody('otherUsers').isArray().withMessage(Errors.Room.BadOtherUsers),
    checkBody('otherUsers').notEmpty().withMessage(Errors.Room.BadOtherUsers),
    checkBody('otherUsers.*').isString().withMessage((value) => ({
      error: Errors.Room.BadOtherUsers,
      value,
    })),
    checkToken,
    checkUserExists,
    getRoom,
  ],
  async (req, res) => {
    const userIds = [...new Set([...req.body.otherUsers])];
    let users = await User.find({ _id: { $in: userIds }, isDeleted: false });

    if (userIds.length > users.length) {
      const missingUsers = userIds.filter((userId) => users.some(({ _id }) => userId === _id));

      return res.status(404).json({
        // todo: maybe use a more appropriate error type
        error: Errors.Login.AccountNotFound,
        missingUsers,
      });
    }

    const { state: { room } } = req;
    users = users.filter(({ rooms }) => !rooms.includes(room._id));

    room.users = room.users.concat(userIds);

    await Promise.all([
      room.save(),
      ...users.map((user) => {
        user.rooms.push(room._id);
        return user.save();
      }),
    ]);

    // todo: send ws notif
    // todo: update roomActiveUsers

    return res.status(201).send();
  },
);

// todo: test this more throughly
/**
 * @openapi
 * /room/leave/{roomId}:
 *   post:
 *     tags:
 *       - room
 *     description: Leave a room
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
 *       410:
 *         description: User has been deleted
 *       201:
 *         description: User left the room successfully
 */
roomRouter.post('/leave/:roomId', [checkToken, getUser, getRoom], async (req, res) => {
  const { state: { user, room } } = req;

  let idx = user.rooms.findIndex((id) => room._id.equals(id));
  user.rooms.splice(idx, 1);

  if (room.users.length === 1) {
    await Promise.all([
      user.save(),
      Room.findByIdAndRemove(room._id),
      room.posts.map((postId) => Post.findByIdAndRemove(postId)),
      room.deletedUsers.map(async (userId) => {
        const otherUser = await User.findById(userId);
        const idx2 = otherUser.rooms.findIndex((id) => room._id.equals(id));

        otherUser.rooms.splice(idx2, 1);
        return otherUser.save();
      }),
    ]);

    return res.status(201).send();
  }

  idx = room.users.findIndex((id) => user._id.equals(id));
  room.users.splice(idx, 1);

  // todo: send ws notif ?
  // todo: update roomActiveUsers

  await Promise.all([
    user.save(),
    room.save(),
  ]);

  return res.status(201).send();
});

// todo: implement ticket based auth ?
// -> (https://devcenter.heroku.com/articles/websocket-security#authentication-authorization)
// todo: openapi comment
roomRouter.ws('/websocket', roomWebsocket);

/**
 * @openapi
 * /room/post/{roomId}:
 *   post:
 *     tags:
 *       - room
 *     description: Post to a room
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/MongoId'
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 format: string
 *                 example: "What are you up to ?"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       400:
 *         description: >-
 *           Bad request, details are returned, can be because of:
 *           MissingToken, BadAuthType, BadPostContent (ex: Basic instead of Bearer)
 *       401:
 *         description: >-
 *           Bad token (not created by this server or expired)
 *           or user doesn't have access to the room
 *       404:
 *         description: The user or the room was not found
 *       410:
 *         description: User has been deleted
 *       200:
 *         description: Returns info on the room
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - postId
 *               properties:
 *                 postId:
 *                   $ref: '#/components/schemas/MongoId'
 */
roomRouter.post(
  '/post/:roomId',
  [
    checkBody('content').notEmpty().withMessage(Errors.Room.BadPostContent),
    checkToken,
    getUser,
    getRoom,
  ],
  async (req, res) => {
    const { state: { user, room }, body: { content } } = req;

    const post = new Post({
      user: user._id,
      room: room._id,
      content,
    });
    room.posts.push(post._id);

    await Promise.all([
      post.save(),
      room.save(),
    ]);

    if (!req.app.locals.roomActiveUsers.has(room._id.toString())) {
      return res.status(200).json({
        postId: post._id,
      });
    }

    const activeUsers = req.app.locals.roomActiveUsers.get(room._id.toString());
    const notif = JSON.stringify({
      userId: user._id,
      roomId: room._id,
      postId: post._id,
      content,
    });

    await Promise.all(
      [...activeUsers].filter((userId2) => userId2 !== user._id.toString()).map((userId2) => {
        const wsUser = req.app.locals.ws.get(userId2);
        return wsUser.send(notif);
      }),
    );

    return res.status(200).json({
      postId: post._id,
    });
  },
);

// todo: test this
// todo: write swagger jsdoc
roomRouter.get('/read/:postId', [checkToken, getUser, getPost], async (req, res) => {
  res.status(200).json({
    post: {
      user: req.state.post.user,
      room: req.state.post.room,
      content: req.state.post.content,
      createdAt: req.state.post.createdAt,
      updatedAt: req.state.post.updatedAt,
    },
  });
});

export default roomRouter;
