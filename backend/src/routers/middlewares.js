/* eslint no-underscore-dangle: 0 */ // --> OFF

import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { validationResult } from 'express-validator';
import morgan from 'morgan';
import chalk from 'chalk';

import Errors from '../errors';
import User from '../models/user';
import Room from '../models/room';
import Post from '../models/post';

// todo: use better secret + put in .env file
export const SECRET = 'secret';

export const logger = morgan(`[:user-agent] ${chalk.green(':method')} ${chalk.red(':url')} ${chalk.blue(':status')} - :date`);

// todo: handle token versionning
export function checkToken(req, res, next) {
  const auth = req.headers.Authorization || req.headers.authorization;

  if (auth === undefined) {
    return res.status(400).json({
      error: Errors.Login.MissingToken,
    });
  }

  const authMatch = auth.match(/^([Bb]earer|[Tt]oken) (?<token>.+)$/);

  if (authMatch === null) {
    return res.status(400).json({
      errors: Errors.Login.BadAuthType,
    });
  }

  const { groups: { token } } = authMatch;
  let userId;

  try {
    userId = jwt.verify(token, SECRET).userId;
  } catch (e) {
    return res.status(401).json({
      error: Errors.Login.BadToken,
    });
  }

  req.state = { ...req.state, userId };
  return next();
}

export async function getUser(req, res, next) {
  if (!Types.ObjectId.isValid(req.state.userId)) {
    return res.status(400).json({
      error: Errors.BadId,
    });
  }

  const user = await User.findById(req.state.userId);

  if (user === null) {
    return res.status(404).json({
      error: Errors.Login.AccountNotFound,
    });
  }

  if (user.isDeleted) {
    return res.status(410).json({
      error: Errors.Login.UserIsDeleted,
    });
  }

  req.state = { ...req.state, user, userId: user._id };
  return next();
}

export async function getUserEvenIfDeleted(req, res, next) {
  if (!Types.ObjectId.isValid(req.state.userId)) {
    return res.status(400).json({
      error: Errors.BadId,
    });
  }

  const user = await User.findById(req.state.userId);

  if (user === null) {
    return res.status(404).json({
      error: Errors.Login.AccountNotFound,
    });
  }

  req.state = { ...req.state, user, userId: user._id };
  return next();
}

export function checkUserExists(req, res, next) {
  if (!Types.ObjectId.isValid(req.state.userId)) {
    return res.status(400).json({
      error: Errors.BadId,
    });
  }

  if (!(User.exists({ _id: req.state.userId, isDeleted: false }))) {
    return res.status(404).json({
      error: Errors.Login.AccountNotFound,
    });
  }

  return next();
}

export async function getRoom(req, res, next) {
  if (req.params.roomId === undefined) {
    return res.status(400).json({
      error: Errors.Room.MissingRoomId,
    });
  }

  if (!Types.ObjectId.isValid(req.state.roomId)) {
    return res.status(400).json({
      error: Errors.BadId,
    });
  }

  const room = await Room.findById(req.params.roomId);

  if (room === null) {
    return res.status(404).json({
      error: Errors.Room.RoomNotFound,
    });
  }

  if (!room.users.includes(req.state.userId)) {
    return res.status(401).json({
      error: Errors.Room.NotInRoom,
    });
  }

  req.state = { ...req.state, room };
  return next();
}

export async function getPost(req, res, next) {
  if (req.params.postId === undefined) {
    return res.status(400).json({
      error: Errors.Room.MissingPostId,
    });
  }

  if (!Types.ObjectId.isValid(req.state.postId)) {
    return res.status(400).json({
      error: Errors.BadId,
    });
  }

  const post = await Post.findById({ _id: req.params.postId });

  if (post === null) {
    return res.status(404).json({
      error: Errors.Room.PostNotFound,
    });
  }

  if (!req.state.user.rooms.includes(post.room)) {
    return res.status(401).json({
      error: Errors.Room.NotInRoom,
    });
  }

  req.state = { ...req.state, post };
  return next();
}

export function validateArgs(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map(({ msg }) => msg),
    });
  }

  return next();
}

export function internalError(err, req, res) {
  // eslint-disable-next-line no-console
  console.error(err);

  res.status(500).json({
    error: Errors.InternalError,
  });
}
