/* eslint no-underscore-dangle: 0 */ // --> OFF

import express from 'express';
import { body as checkBody, param as checkParam } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import Errors from '../errors';
import {
  checkToken,
  getUser,
  validateArgs,
} from './middlewares';
import User from '../models/user';

// todo: use better secret + put in .env file
const SECRET = 'secret';
// Format for describing time: https://github.com/vercel/ms#examples
const TOKEN_EXPIRES_IN = '10 days';

const loginRouter = express.Router();

/**
 * @openapi
 * /login/users:
 *   get:
 *     tags:
 *       - login
 *     description: Get all usernames
 *     responses:
 *       200:
 *         description: Returns all usernames
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - users
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: string
 *                     format: string
 *                     example: Tabasco
 */
loginRouter.get('/users', [], async (req, res) => {
  const users = await User.find({});

  res.status(200).json({
    users: users.map(({ username }) => username),
  });
});

/**
 * @openapi
 * /login/userId/{username}:
 *   get:
 *     tags:
 *       - login
 *     description: Get a user's Id from a username
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *           format: username
 *     responses:
 *       404:
 *         description: User not found
 *       200:
 *         description: Returns the user's id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - userId
 *               properties:
 *                 userId:
 *                   $ref: '#/components/schemas/MongoId'
 */
loginRouter.get('/userId/:username', [], async (req, res) => {
  const { params: { username } } = req;
  const user = await User.findOne({ username });

  if (user === null) {
    return res.status(404).json({
      error: Errors.Login.AccountNotFound,
    });
  }

  return res.status(200).json({
    userId: user._id,
  });
});

/**
 * @openapi
 * /login/username/{userId}:
 *   get:
 *     tags:
 *       - login
 *     description: Get a username from a user's Id
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/MongoId'
 *     responses:
 *       404:
 *         description: User not found
 *       200:
 *         description: Returns the username
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - username
 *               properties:
 *                 username:
 *                   type: string
 *                   format: string
 */
loginRouter.get('/username/:userId', [], async (req, res) => {
  const { params: { userId } } = req;
  const user = await User.findById(userId);

  if (user === null) {
    return res.status(404).json({
      error: Errors.Login.AccountNotFound,
    });
  }

  return res.status(200).json({
    username: user.username,
  });
});

// todo: body should be form
// todo: maybe make regex for username
/**
 * @openapi
 * /login/register:
 *   post:
 *     tags:
 *       - login
 *     description: Registers a new user
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 format: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 pattern: /^(?=.+[A-Z])(?=.+[0-9]).{7,}$/
 *     responses:
 *       400:
 *         description: Email or password is missing or has bad format
 *       409:
 *         description: Email is already taken
 *       200:
 *         description: >-
 *           Returns the new user id, a token, and the time it will take for the token to expire
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SigninResult'
 */
loginRouter.post(
  '/register',
  [
    checkBody('email').isEmail().withMessage(Errors.Registration.BadEmail),
    checkBody('username')
      .not().isEmpty()
      .withMessage(Errors.Registration.BadUsername),
    checkBody('password')
      .matches(/^(?=.+[A-Z])(?=.+[0-9]).{7,}$/)
      .withMessage(Errors.Registration.BadPassword),
    validateArgs,
  ],
  async (req, res) => {
    const { body: { username, email, password } } = req;

    // todo: check username is unique
    const userExists = await User.findOne({ email });

    if (userExists !== null) {
      return res.status(409).json({
        error: Errors.Registration.EmailTaken,
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      username,
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
  },
);

/**
 * @openapi
 * /login/signin/{username}:
 *   get:
 *     tags:
 *       - login
 *     description: Sign in and get a token
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *           format: username
 *     security:
 *       - basicAuth: []
 *     responses:
 *       400:
 *         description: >-
 *           Bad request, details are returned, can be because of:
 *           MissingToken, BadAuthType (ex: Bearer instead of Basic)
 *       401:
 *         description: Invalid password
 *       404:
 *         description: User not found
 *       200:
 *         description: >-
 *           Returns the user id, a token, and the time it will take for the token to expire
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SigninResult'
 */
loginRouter.get(
  '/signin/:username',
  [
    checkParam('username').not().isEmpty().withMessage(Errors.Registration.BadUsername),
    validateArgs,
  ],
  async (req, res) => {
    const { params: { username } } = req;
    const user = await User.findOne({ username });

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
  },
);

/**
 * @openapi
 * /login/info:
 *   get:
 *     tags:
 *       - login
 *     description: Get info on a user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       400:
 *         description: >-
 *           Bad request, details are returned, can be because of:
 *           MissingToken, BadAuthType (ex: Basic instead of Bearer)
 *       401:
 *         description: Bad token (not created by this server or expired)
 *       404:
 *         description: User not found
 *       200:
 *         description: Returns the user's username, email and the ids of the rooms they're in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - username
 *                 - email
 *                 - rooms
 *               properties:
 *                 username:
 *                   type: string
 *                   format: string
 *                 email:
 *                   type: string
 *                   format: format
 *                 rooms:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MongoId'
 */
loginRouter.get('/info', [checkToken, getUser], async (req, res) => {
  res.status(200).json({
    user: {
      username: req.state.user.username,
      email: req.state.user.email,
      rooms: req.state.user.rooms,
    },
  });
});

// todo: remove user from rooms
// todo: maybe archive account instead so there aren't posts pointing to deleted users
// todo: update webSockets
/**
 * @openapi
 * /login/delete:
 *   delete:
 *     tags:
 *       - login
 *     description: Delete a user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       400:
 *         description: >-
 *           Bad request, details are returned, can be because of:
 *           MissingToken, BadAuthType (ex: Basic instead of Bearer)
 *       401:
 *         description: Bad token (not created by this server or expired)
 *       404:
 *         description: User not found
 *       200:
 *         description: Returns the user's username, email and the ids of the rooms they're in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - username
 *                 - email
 *                 - rooms
 *               properties:
 *                 username:
 *                   type: string
 *                   format: string
 *                 email:
 *                   type: string
 *                   format: format
 *                 rooms:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MongoId'
 */
loginRouter.delete('/delete', [checkToken], async (req, res) => {
  const user = await User.findByIdAndRemove(req.state.userId);

  if (user === null) {
    return res.status(404).json({
      error: Errors.Login.AccountNotFound,
    });
  }

  return res.status(201).send();
});

export default loginRouter;
