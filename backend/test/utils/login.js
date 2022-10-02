import axios from 'axios';

import { url } from './utils';

export async function register(username, email, password) {
  return axios({
    method: 'post',
    url: `${url}/login/register`,
    data: {
      username,
      email,
      password,
    },
  });
}

export async function signin(username, password) {
  return axios({
    method: 'get',
    url: `${url}/login/signin/${username}`,
    headers: {
      authorization: `Basic ${password}`,
    },
  });
}

export async function getUsernames() {
  return axios({
    method: 'get',
    url: `${url}/login/users`,
  });
}

export async function getUserInfo(token) {
  return axios({
    method: 'get',
    url: `${url}/login/info`,
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
}

export async function getUserId(username) {
  return axios({
    method: 'get',
    url: `${url}/login/userId/${username}`,
  });
}

export async function getUsername(userId) {
  return axios({
    method: 'get',
    url: `${url}/login/username/${userId}`,
  });
}

export async function deleteUser(token) {
  return axios({
    method: 'delete',
    url: `${url}/login/delete`,
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
}
