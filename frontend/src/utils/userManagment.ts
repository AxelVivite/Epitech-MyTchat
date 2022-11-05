import axios from 'axios';
import { Friend } from './globalStateManager/globalStateObjects';

const devUrl = 'http://localhost:3000';

export const register = async (email: string, password: string, username: string) => {
  try {
    const { data, status } = await axios.post<undefined>(
      `${devUrl}/login/register`,
      { email, password, username },
    );
    return { data, status };
  } catch (err) {
    return null;
  }
};

// const ERRORS_REGISTER = new Map([
//   ['BadEmail', "Mauvais format d'email. Veuillez le modifier et recommencer"],
//   ['BadPassword', 'Mauvais format de mot de passe. Veuillez le modifier et recommencer'],
//   ['EmailTaken', 'Cet adresse email est déjà utiliser.
// Veuillez en utiliser une autre et recommencer'],
// ]);

export const login = async (email: string, password: string) => {
  try {
    const { data, status } = await axios.get<object>(
      `${devUrl}/login/signin/${email}`,
      {
        headers: {
          Authorization: `Basic ${password}`,
        },
      },
    );
    if (status === 200) {
      return { data, status };
    }
    return { data, status };
  } catch (err) {
    return null;
  }
};

interface getUsernameInterface {
  username: string;
}

interface usersInterface {
  username: string;
  userId: string;
  key: number;
}

const matchUsernameAndId = async (usersName: [string]) => {
  const users: usersInterface[] = [];
  try {
    usersName.forEach(async (value, index) => {
      const { data, status } = await axios.get(
        `${devUrl}/login/userId/${value}`,
      );

      if (status === 200) {
        const newUser: usersInterface = {
          username: value,
          userId: data.userId,
          key: index,
        };
        users.push(newUser);
      }
    });
    return users;
  } catch (err) {
    return null;
  }
};

export const getAllUsers = async () => {
  try {
    const { data, status } = await axios.get(
      `${devUrl}/login/users`,
    );
    if (status === 200) {
      return matchUsernameAndId(data.users);
    }
  } catch (err) {
    return [];
  }
  return [];
};

export const getUsername = async (userId: string, token: string) => {
  try {
    const { data, status } = await axios.get<getUsernameInterface>(
      `${devUrl}/login/username/${userId}`,
      {
        headers: {
          token: `Bearer ${token}`,
        },
      },
    );
    if (status === 200) {
      return data.username;
    }
  } catch (err) {
    return null;
  }
  return null;
};

export const getFriendsList = async (token: string, friendsId: string[], userId: string) => {
  const friends: Friend[] = [];
  if (friendsId.length === 0) { return []; }
  friendsId.forEach(async (value) => {
    if (value !== userId) {
      const friendName = await getUsername(token, value);
      const friend: Friend = {
        userId: value,
        username: friendName as string,
      };
      friends.push(friend);
    }
  });

  return friends;
};
