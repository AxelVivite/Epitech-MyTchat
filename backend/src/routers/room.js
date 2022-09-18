/* eslint no-underscore-dangle: 0 */ // --> OFF

import express from 'express';

import Errors from '../errors';
import { checkToken, checkUserExists } from './middlewares';
import User from '../models/user';
import Room from '../models/room';
import Post from '../models/post';

const roomRouter = express.Router();

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

  return res.status(200).json({
    roomId: room._id,
  });
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

// todo
roomRouter.get('/websocket', (req, res) => {
  res.status(200);
});

// todo: test this route
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
