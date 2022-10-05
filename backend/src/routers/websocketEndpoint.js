/* eslint no-console: 0 */ // --> OFF
/* eslint no-underscore-dangle: 0 */ // --> OFF

import url from 'url';

import jwt from 'jsonwebtoken';
import chalk from 'chalk';

import Errors from '../errors';
import { SECRET } from './middlewares';
import User from '../models/user';

function logger(req) {
  console.log(`[${req.ws._socket.remoteAddress}] ${chalk.green('WS')} ${chalk.red('/room/websocket')} - ${(new Date()).toUTCString()}`);
}

async function onClose(ws, req, userId) {
  const user = await User.findById(userId);

  req.app.locals.wsReg.disconnectUser(userId, user.rooms);
}

export default async function websocketEndpoint(ws, req) {
  try {
    logger(req);

    const { query: { token } } = url.parse(req.url, true);

    let userId;

    if (token === undefined) {
      ws.send(Errors.Login.MissingToken, () => {
        ws.close();
      });
      return;
    }

    try {
      userId = jwt.verify(token, SECRET).userId;
    } catch (e) {
      ws.send(Errors.Login.BadToken, () => {
        ws.close();
      });
      return;
    }

    const user = await User.findById(userId);

    if (user === null) {
      ws.send(Errors.Login.AccountNotFound, () => {
        ws.close();
      });
      return;
    }

    if (user.isDeleted) {
      ws.send(Errors.Login.UserIsDeleted, () => {
        ws.close();
      });
      return;
    }

    ws.on('close', () => onClose(ws, req, userId).catch((err) => console.error(err)));
    req.app.locals.wsReg.connectUser(userId, ws, user.rooms.map(String));

    // todo
    // ws.on('error', (err) => {});
  } catch (err) {
    console.error(err);
  }
}
