import getUsernames from './login/getUsernames';
import getUsername from './login/getUsername';
import getUserId from './login/getUserId';
import register from './login/register';
import signin from './login/signin';
import getUserInfo from './login/getUserInfo';
import deleteUser from './login/deleteUser';

import createRoom from './room/createRoom';
import roomInfo from './room/roomInfo';
import invite from './room/invite';
import leave from './room/leave';
import postMsg from './room/postMsg';
import readMsg from './room/readMsg';

describe('backend', () => {
  describe('login', () => {
    describe('GET /login/users', getUsernames);
    describe('GET /login/username/{userId}', getUsername);
    describe('GET /login/userId/{username}', getUserId);
    describe('POST /login/register', register);
    describe('POST /login/signin/{username}', signin);
    describe('GET /login/info', getUserInfo);
    describe('DELETE /login/delete/', deleteUser);
  });

  describe('room', () => {
    describe('POST /room/create', createRoom);
    describe('GET /room/info/{roomId}', roomInfo);
    describe('POST /room/invite/{roomId}', invite);
    describe('POST /room/leave/{roomId}', leave);
    describe('POST /room/post/{roomId}', postMsg);
    describe('POST /room/read/{postId}', readMsg);
  });

  // todo
  // describe('websocket', () => {
  // });

  // todo
  // describe('other', () => {
  //   describe('404 route not found', () => {});
  //   describe('500 internal error', () => {});
  // });
});
