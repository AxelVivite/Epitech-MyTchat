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

import connectWs from './websocket/connectWs';
import wsPostMsg from './websocket/postMsg';
import wsCreateRoom from './websocket/createRoom';
import wsInvite from './websocket/invite';
import wsLeave from './websocket/leave';
import wsDeleteUser from './websocket/deleteUser';

import routeNotFound from './other/routeNotFound';

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

  describe('websocket', () => {
    describe('WS /room/websocket', connectWs);
    describe('POST /room/create', wsCreateRoom);
    describe('POST /room/invite/{roomId}', wsInvite);
    describe('POST /room/leave/{roomId}', wsLeave);
    describe('POST /room/post/{roomId}', wsPostMsg);
    describe('POST /login/delete', wsDeleteUser);
  });

  describe('other', () => {
    describe('404 route not found', routeNotFound);
  // todo
  //   describe('500 internal error', () => {});
  });
});
