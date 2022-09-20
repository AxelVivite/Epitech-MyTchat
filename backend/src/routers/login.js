/* eslint no-underscore-dangle: 0 */ // --> OFF

import express from 'express';
import validator from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import Errors from '../errors';
import { checkToken, checkUserExists, getUser } from './middlewares';
import User from '../models/user';

// todo: use better secret + put in .env file
const SECRET = 'secret';
// Format for describing time: https://github.com/vercel/ms#examples
const TOKEN_EXPIRES_IN = '10 days';

const loginRouter = express.Router();

// todo: Should probably be removed
loginRouter.get('/users', async (req, res) => {
  const users = await User.find({});

  res.status(200).json(users.map(({ _id }) => _id));
});

loginRouter.get('/info', [checkToken, getUser], async (req, res) => {
  res.status(200).json({
    user: {
      email: req.state.user.email,
    },
  });
});

loginRouter.get('/signin/:email', async (req, res) => {
  // todo: check email
  const { params: { email } } = req;
  const user = await User.findOne({ email });

  if (user === null) {
    return res.status(404).json({
      error: Errors.Login.AccountNotFound,
    });
  }

  const auth = req.headers.Authorization || req.headers.authorization;

  if (auth === undefined) {
    return res.status(400).json({
      error: Errors.Login.MissingToken,
    });
  }

  const authMatch = auth.match(/^Basic (?<password>.+)$/);

  if (authMatch === null) {
    return res.status(400).json({
      error: Errors.Login.BadAuthType,
    });
  }

  const { groups: { password } } = authMatch;
  const passwordCorrect = await bcrypt.compare(password, user.passwordHash);

  if (!passwordCorrect) {
    return res.status(401).json({
      error: Errors.Login.InvalidPassword,
    });
  }

  const token = jwt.sign(
    { userId: user._id.toString() },
    SECRET,
    { expiresIn: TOKEN_EXPIRES_IN },
  );

  return res.status(200).json({
    userId: user._id.toString(),
    token,
    expiresIn: TOKEN_EXPIRES_IN,
  });
});

loginRouter.post('/register', async (req, res) => {
  // todo: check email
  const { body: { email } } = req;

  const userExists = await User.findOne({ email });

  if (userExists !== null) {
    return res.status(409).json({
      error: Errors.Registration.EmailTaken,
    });
  }

  // todo: check password
  const passwordHash = await bcrypt.hash(req.body.password, 10);

  const user = new User({
    email,
    passwordHash,
  });

  await user.save();

  const token = jwt.sign(
    { userId: user._id.toString() },
    SECRET,
    { expiresIn: TOKEN_EXPIRES_IN },
  );

  return res.status(200).json({
    userId: user._id.toString(),
    token,
    expiresIn: TOKEN_EXPIRES_IN,
  });
});

// todo: remove user from rooms
// todo: maybe archive account instead so there aren't posts pointing to deleted users
// todo: update webSockets
loginRouter.delete('/delete', [checkToken, checkUserExists], async (req, res) => {
  await User.findByIdAndRemove(req.state.userId);

  res.status(201).send();
});

export default loginRouter;
