import axios from 'axios';

import { url } from './utils';

export async function createRoom(token, otherUsers = [], name = '') {
  return axios({
    method: 'post',
    url: `${url}/room/create`,
    headers: {
      authorization: `Bearer ${token}`,
    },
    data: {
      name,
      otherUsers,
    },
  });
}

export async function getRoom(token, roomId, getLastPost = false) {
  return axios({
    method: 'get',
    url: `${url}/room/info/${roomId}${getLastPost ? '?getLastPost' : ''}`,
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
}

export async function invite(token, roomId, otherUsers) {
  return axios({
    method: 'post',
    url: `${url}/room/invite/${roomId}`,
    headers: {
      authorization: `Bearer ${token}`,
    },
    data: {
      otherUsers,
    },
  });
}

export async function leave(token, roomId) {
  return axios({
    method: 'post',
    url: `${url}/room/leave/${roomId}`,
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
}

export async function postMsg(token, roomId, content) {
  return axios({
    method: 'post',
    url: `${url}/room/post/${roomId}`,
    headers: {
      authorization: `Bearer ${token}`,
    },
    data: {
      content,
    },
  });
}

export async function readMsg(token, postId) {
  return axios({
    method: 'get',
    url: `${url}/room/read/${postId}`,
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
}
