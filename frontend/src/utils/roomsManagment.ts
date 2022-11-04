import axios from 'axios';
import { getFriendsList } from './userManagment';
import {
  Room, Post, Friend,
} from './globalStateManager/globalStateObjects';

const devUrl = 'http://localhost:3000';

interface roomInfoProps {
  room: {
    lastPost: {
      user: Friend,
      content: string,
      createdAt: string,
    };
    name: string;
    users: [string];
  }
}

const roomInfo = async (token: string, roomId: string, userId: string) => {
  try {
    const { data, status } = await axios.get<roomInfoProps>(
      `${devUrl}/room/info/${roomId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          getLastPost: true,
        },
      },
    );
    if (status === 200) {
      // console.log(`${data.room.lastPost.content}`);
      const lastMessage: Post = (data.room.lastPost === null) ? {
        sender: null,
        message: '',
        messageDate: '',
      } : {
        sender: data.room.lastPost.user,
        message: data.room.lastPost.content,
        messageDate: data.room.lastPost.createdAt,
      };
      const friends: Friend[] = await getFriendsList(token, data.room.users, userId);
      const room: Room = {
        roomId,
        name: data.room.name,
        lastMessage,
        friends,
      };
      return room;
    }
  } catch (err) {
    return null;
  }
  return null;
};

interface createRoomReturnProps {
  roomId: string;
}
export const createRoom = async (token: string, name: string, userId: string, users?: [string]) => {
  try {
    const friends: [string] | [] | undefined = users !== null ? users : [];

    const { data, status } = await axios.post<createRoomReturnProps>(
      `${devUrl}/room/create`,
      {
        name,
        otherUsers: friends,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (status === 200) {
      return roomInfo(token, data.roomId, userId);
    }
  } catch (err) {
    return null;
  }
  return null;
};

interface getRoomsIdReturnProps {
  user: {
    rooms: string[];
  }
}

const getRoomsId = async (token: string) => {
  try {
    const { data, status } = await axios.get<getRoomsIdReturnProps>(
      `${devUrl}/login/info/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (status === 200) {
      return data.user.rooms;
    }
    return null;
  } catch (err) {
    return null;
  }
};

export const getRooms = async (token: string, userId: string) => {
  try {
    const roomsIds = await getRoomsId(token);
    if (roomsIds?.length === 0) { return []; }
    const rooms: Room[] = [];
    roomsIds?.forEach(async (value: string) => {
      const room = await roomInfo(token, value, userId);
      rooms.push(room as Room);
    });
    return rooms;
  } catch (err) {
    return null;
  }
};
