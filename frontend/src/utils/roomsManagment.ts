import axios from 'axios';
import {
  Room, User, Post, Friend,
} from '../utils/globalStateManager/globalStateObjects';
import { getFriendsList } from './userManagment';

const devUrl = 'http://localhost:3000';

const roomInfo = async (token: string, roomId: string) => {
  try {
    const { data, status } = await axios.get<any>(
      `${devUrl}/room/info/${roomId}`,
      {
        headers: {
          token: `Bearer ${token}`,
        },
      },
    );

    if (status === 200) {
      const friends: [Friend | null] = await getFriendsList(token, data.users);
      const lastMessage: Post = {
        sender: data.lastPost.user,
        message: data.lastPost.content,
        messageDate: data.lastPost.createdAt,
      };
      const room: Room = {
        roomId,
        name: data.name,
        lastMessage,
        friends,

      };
      return room;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
  return null;
};

export const createRoom = async (token: string, name: string, users?: [string]) => {
  try {
    const friends: any = users !== null ? users : [];

    const { data, status } = await axios.post<any>(
      `${devUrl}room/create`,
      {
        name,
        otherUsers: friends,
      },
    );

    if (status === 200) {
      return await roomInfo(token, data.roomId);
    }
  } catch (err) {
    console.log(err);
  }
};

export const getRooms = async (token: string) => {
  try {
    const roomsIds = await getRoomsId(token);
    if (roomsIds.lenght() === 0) { return []; }
    const rooms: [Room | null] = [null];

    for (const roomId in roomsIds) {
      const room = await roomInfo(token, roomId);
      rooms.push(room);
    }
    return rooms;
  } catch (err) {
    console.log(err);
  }
};

const getRoomsId = async (token: string) => {
  try {
    const { data, status } = await axios.get<any>(
      `${devUrl}/login/info/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (status === 200) {
      return data.rooms;
    }
    return null;
  } catch (err) {
    console.log(err);
  }
};
