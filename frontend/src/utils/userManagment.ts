import axios from 'axios';
import { Friend } from './globalStateManager/globalStateObjects';

const devUrl = 'http://localhost:3000';

export const register = async (email: string, password: string, username: string) => {
  try {
    const { data, status } = await axios.post<any>(
      `${devUrl}/login/register`,
      { email, password, username },
    );
    alert(data.token + status);
    return { data, status };
  } catch (err) {
    console.log(err);
    return null;
  }
};

const ERRORS_REGISTER = new Map([
  ['BadEmail', "Mauvais format d'email. Veuillez le modifier et recommencer"],
  ['BadPassword', 'Mauvais format de mot de passe. Veuillez le modifier et recommencer'],
  ['EmailTaken', 'Cet adresse email est déjà utiliser. Veuillez en utiliser une autre et recommencer'],
]);

export const login = async (email: string, password: string) => {
  try {
    const { data, status } = await axios.get<any>(
      `${devUrl}/login/signin/${email}`,
      {
        headers: {
          Authorization: `Basic ${password}`,
        },
      },
    );
    if (status === 200) {
      // const navigator = useNavigate();
      // navigator('/test');
      console.log('Salut');
      // TODO: Here change it with the home page screen when implemented
    } else {
      console.log(status);
      console.log(data);
      const { error } = data;
      alert(ERRORS_REGISTER.get(error));
    }
    alert(`${data.token} | status => ${status}`);
    return { data, status };
  } catch (err) {
    console.log(err);
  }
};

const getUsername = async (userId: string, token: string) => {
  try {
    const { data, status } = await axios.get<any>(
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
    console.log(err);
  }
};

export const getFriendsList = async (token: string, friendsId: [string]) => {
  const friends: [Friend | null] = [null];

  for (const friendId in friendsId) {
    const friendName = await getUsername(token, friendId);

    const friend = {
      userId: friendId,
      username: friendName,
    };
    friends.push(friend);
  }

  return friends;
};
