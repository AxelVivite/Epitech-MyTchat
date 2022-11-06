import axios from 'axios';
import { getFriendsList } from './userManagment';
import {
  Room, Post, Friend,
} from './globalStateManager/globalStateObjects';

const devUrl = 'http://13.68.235.186:8080';

interface roomInfoProps {
  room: {
    lastPost: {
      user: Friend,
      content: string,
      createdAt: string,
    };
    posts: string[],
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
export const createRoom = async (token: string, name: string, userId: string, users?: string[]) => {
  try {
    const friends: string[] | [] | undefined = users !== null ? users : [];

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

interface PostInfo {
  username: string;
  user: string;
  content: string;
  createdAt: string;
}

interface PostsInterface {
  posts: PostInfo[];
}

export const sendMessage = async (token: string, message: string, roomId: string) => {
  try {
    const { status } = await axios.post<createRoomReturnProps>(
      `${devUrl}/room/post/${roomId}`,
      {
        content: message,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (status === 200) {
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
};

export const getMessages = async (token: string, roomId: string) => {
  const posts: Post[] = [];

  const { data, status } = await axios.get<PostsInterface>(
    `${devUrl}/room/readAll/${roomId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!status) {
    return [];
  }

  for (let i = 0; data.posts[i]; i += 1) {
    const postTmp: Post = {
      sender: {
        username: data.posts[i].username,
        userId: data.posts[i].user,
      },
      message: data.posts[i].content,
      messageDate: data.posts[i].createdAt,
    };
    posts.push(postTmp);
  }

  return posts;
};

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
    const roomsPromised: Promise<Room>[] = [];

    if (roomsIds?.length === 0) {
      return [];
    }

    roomsIds?.forEach(async (value: string) => {
      const room = roomInfo(token, value, userId) as Promise<Room>;
      roomsPromised.push(room);
    });
    return (await Promise.all(roomsPromised));
  } catch (err) {
    return null;
  }
};
