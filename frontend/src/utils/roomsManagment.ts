import axios from 'axios';
import { getFriendsList, getUsername } from './userManagment';
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

const getPosts = async (token: string, roomId: string) => {
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
      return data.room.posts;
    }
    return null;
  } catch (err) {
    return null;
  }
};

interface PostInfo {
  post: {
    user: string;
    content: string;
    createdAt: string;
  }
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
  try {
    const postsId = await getPosts(token, roomId);
    // if (postsId === []) { return []; }
    const posts: Post[] = [];
    postsId?.forEach(async (value) => {
      const { data, status } = await axios.get<PostInfo>(
        `${devUrl}/room/read/${value}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (status === 200) {
        const username = await getUsername(data.post.user, token);
        const postTmp: Post = {
          sender: {
            username: username as string,
            userId: data.post.user,
          },
          message: data.post.content,
          messageDate: data.post.createdAt,
        };
        posts.push(postTmp);
      } else {
        const postTmpError: Post = {
          sender: {
            username: 'error',
            userId: 'error',
          },
          message: 'Error',
          messageDate: '',
        };
        posts.push(postTmpError);
      }
      return posts;
    });
  } catch (err) {
    return [];
  }
  return [];
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
