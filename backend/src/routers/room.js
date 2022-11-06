/* eslint no-underscore-dangle: 0 */ // --> OFF

import express from 'express';
import expressWs from 'express-ws';
import { body as checkBody } from 'express-validator';
import { Types } from 'mongoose';

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
import websocketEndpoint from './websocketEndpoint';

const roomRouter = express.Router();
expressWs(roomRouter);

// todo: make route(s) so you don't load all messages at once

// todo: add query flag to continue even if some users are invalid
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
    checkBody('otherUsers').default([]).isArray().withMessage(Errors.Room.BadOtherUsers),
    checkBody('otherUsers.*').isString().withMessage(Errors.BadId),
    checkBody('otherUsers.*').custom((value) => Types.ObjectId.isValid(value)).withMessage(Errors.BadId),
    validateArgs,
    checkToken,
    getUser,
  ],
  async (req, res) => {
    // todo: try to do this with expressValidators
    if (req.body.name !== undefined && typeof req.body.name !== 'string') {
      return res.status(400).json({
        error: Errors.Room.BadRoomName,
      });
    }

    const userIds = [...new Set([req.state.userId.toString(), ...req.body.otherUsers])];
    const users = await User.find({ _id: { $in: userIds }, isDeleted: false });

    if (userIds.length > users.length) {
      const missingUsers = userIds.filter((userId) => !users.some(({ _id }) => _id.equals(userId)));

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

    await Promise.all([
      room.save(),
      ...users.map((user) => {
        user.rooms.push(room._id);
        return user.save();
      }),
      req.app.locals.wsReg.createRoom(
        req.state.userId,
        room._id.toString(),
        users.map(({ _id }) => _id.toString()),
      ),
    ]);

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
 *                 - room
 *               properties:
 *                 room:
 *                   $ref: '#/components/schemas/Room'
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
      createdAt: req.state.room.createdAt,
      updatedAt: req.state.room.updatedAt,
    },
  };

  if (req.query.getLastPost === 'true' || req.query.getLastPost === '') {
    if (data.room.posts.length === 0) {
      data.room.lastPost = null;
    } else {
      const post = await Post.findById(data.room.posts[data.room.posts.length - 1]);

      data.room.lastPost = {
        id: post._id,
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

// todo: add query flag to continue even if some users are invalid
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
 *         description: The room or some of the users were not found
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
 *       204:
 *         description: The other users were added successfully
 */
roomRouter.post(
  '/invite/:roomId',
  [
    checkBody('otherUsers').isArray().withMessage(Errors.Room.BadOtherUsers),
    checkBody('otherUsers').notEmpty().withMessage(Errors.Room.BadOtherUsers),
    checkBody('otherUsers.*').isString().withMessage(Errors.BadId),
    checkBody('otherUsers.*').custom((value) => Types.ObjectId.isValid(value)).withMessage(Errors.BadId),
    validateArgs,
    checkToken,
    checkUserExists,
    getRoom,
  ],
  async (req, res) => {
    const userIds = [...new Set([...req.body.otherUsers])];
    let users = await User.find({ _id: { $in: userIds }, isDeleted: false });

    if (userIds.length > users.length) {
      const missingUsers = userIds.filter((userId) => !users.some(({ _id }) => _id.equals(userId)));

      return res.status(404).json({
        // todo: maybe use a more appropriate error type
        error: Errors.Login.AccountNotFound,
        missingUsers,
      });
    }

    const { state: { room, roomId } } = req;
    users = users.filter(({ rooms }) => !rooms.includes(room._id));

    room.users = room.users.concat(userIds);

    await Promise.all([
      room.save(),
      ...users.map((user) => {
        user.rooms.push(roomId);
        return user.save();
      }),
      req.app.locals.wsReg.inviteRoom(
        req.state.userId,
        roomId,
        users.map(({ _id }) => _id.toString()),
      ),
    ]);

    return res.status(204).send();
  },
);

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
 *       204:
 *         description: User left the room successfully
 */
roomRouter.post('/leave/:roomId', [checkToken, getUser, getRoom], async (req, res) => {
  const {
    state: {
      user,
      userId,
      room,
      roomId,
    },
  } = req;

  const idx = user.rooms.findIndex((id) => room._id.equals(id));
  user.rooms.splice(idx, 1);

  if (room.users.length === 1) {
    await Promise.all([
      user.save(),
      Room.findByIdAndRemove(room._id),
      room.posts.map((postId) => Post.findByIdAndRemove(postId)),
      room.deletedUsers.map(async (userId2) => {
        const otherUser = await User.findById(userId2);
        const idx2 = otherUser.rooms.findIndex((id) => room._id.equals(id));

        otherUser.rooms.splice(idx2, 1);
        return otherUser.save();
      }),
    ]);

    return res.status(204).send();
  }

  await Promise.all([
    user.save(),
    Room.findByIdAndUpdate(room._id, { $pull: { users: user._id } }),
    req.app.locals.wsReg.leaveRoom(userId, roomId),
  ]);

  return res.status(204).send();
});

// todo: implement ticket based auth ?
// -> (https://devcenter.heroku.com/articles/websocket-security#authentication-authorization)
roomRouter.ws('/websocket', websocketEndpoint);

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
 *         description: Returns the id of the post
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
    checkBody('content').isString().withMessage(Errors.Room.BadPostContent),
    checkBody('content').notEmpty().withMessage(Errors.Room.BadPostContent),
    validateArgs,
    checkToken,
    getUser,
    getRoom,
  ],
  async (req, res) => {
    const {
      state: {
        userId,
        room,
        roomId,
      },
      body: {
        content,
      },
    } = req;

    const post = new Post({
      user: userId,
      room: roomId,
      content,
    });
    room.posts.push(post._id);

    await Promise.all([
      post.save(),
      room.save(),
    ]);

    await req.app.locals.wsReg.post(userId, roomId, post._id.toString(), content, post.createdAt);

    return res.status(200).json({
      postId: post._id,
    });
  },
);

// todo: move this to a post router
/**
 * @openapi
 * /room/read/{postId}:
 *   get:
 *     tags:
 *       - room
 *     description: Get information on a post
 *     parameters:
 *       - in: path
 *         name: postId
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
 *           or user doesn't have access to the room the post is in
 *       404:
 *         description: The user or the post was not found
 *       410:
 *         description: User has been deleted
 *       200:
 *         description: Returns info on the post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - post
 *               properties:
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 */
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

/**
 * @openapi
 * /room/readAll/{roomId}:
 *   get:
 *     tags:
 *       - room
 *     description: Get all posts in room
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
 *       200:
 *         description: Returns info on all the posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - posts
 *               properties:
 *                 posts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PostReadAll'
 */
roomRouter.get('/readAll/:roomId', [checkToken, checkUserExists, getRoom], async (req, res) => {
  const { state: { room } } = req;

  const posts = await Promise.all(room.posts.map(async (id) => {
    const post = await Post.findById(id);

    return {
      id: post._id,
      user: post.user,
      room: post.room,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }));

  const users = new Map(await Promise.all(
    [...new Set(posts.map(({ user }) => user))].map(async (id) => {
      const user = await User.findById(id);
      return [id.toString(), user.username];
    }),
  ));

  posts.forEach((post) => {
    // eslint-disable-next-line no-param-reassign
    post.username = users.get(post.user.toString());
  });

  res.status(200).json({
    posts,
  });
});

export default roomRouter;
