import getUsernames from './login/getUsernames';
import getUsername from './login/getUsername';
import getUserId from './login/getUserId';
import register from './login/register';
import signin from './login/signin';
import getUserInfo from './login/getUserInfo';
import deleteUser from './login/deleteUser';

describe('login', () => {
  describe('GET /login/users', getUsernames);
  describe('GET /login/username/{userId}', getUsername);
  describe('GET /login/userId/{username}', getUserId);
  describe('POST /login/register', register);
  describe('POST /login/signin/{username}', signin);
  describe('GET /login/info', getUserInfo);
  describe('DELETE /login/delete/', deleteUser);
});
