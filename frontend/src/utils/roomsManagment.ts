import axios from 'axios';
import { getFriendsList } from './userManagment';
import {
  Room, Post, Friend,
} from './globalStateManager/globalStateObjects';

const devUrl = 'http://localhost:3000';

interface roomInfoProps {
  lastPost: {
    user: Friend,
    content: string,
    createdAt: Date,
  };
  name: string;
  users: [string];
}

const roomInfo = async (token: string, roomId: string) => {
  try {
    const { data, status } = await axios.get<roomInfoProps>(
      `${devUrl}/room/info/${roomId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (status === 200) {
      const friends: Friend[] = await getFriendsList(token, data.users);
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
    return null;
  }
  return null;
};

interface createRoomReturnProps {
  roomId: string;
}
export const createRoom = async (token: string, name: string, users?: [string]) => {
  console.log('entrée de creatzRoom');
  // try {
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
  console.log(`status ==${status}`);
  if (status === 200) {
    return roomInfo(token, data.roomId);
  }
  // } catch (err) {
  //   return null;
  // }
  return null;
};

interface getRoomsIdReturnProps {
  rooms: string[];
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
      return data.rooms;
    }
    return null;
  } catch (err) {
    return null;
  }
};

export const getRooms = async (token: string) => {
  try {
    const roomsIds = await getRoomsId(token);
    if (roomsIds?.length === 0) { return []; }
    const rooms: [Room | null] = [null];

    roomsIds?.forEach(async (value: string) => {
      const room = await roomInfo(token, value);
      rooms.push(room);
    });
    return rooms;
  } catch (err) {
    return null;
  }
};
