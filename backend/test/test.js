import register from './login/register';
import signin from './login/signin';
import getUsernames from './login/getUsernames';
import getUserInfo from './login/getUserInfo';
import getUserId from './login/getUserId';
import getUsername from './login/getUsername';
import deleteUser from './login/deleteUser';

describe('login', () => {
  describe('POST /login/register', register);
  describe('POST /login/signin/{username}', signin);
  describe('GET /login/users', getUsernames);
  describe('GET /login/info', getUserInfo);
  describe('GET /login/userId/{username}', getUserId);
  describe('GET /login/username/{userId}', getUsername);
  describe('DELETE /login/delete/', deleteUser);
});
