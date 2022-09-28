import loginRouter from './login';
import roomRouter from './room';

export default [
  {
    path: 'login',
    router: loginRouter,
  },
  {
    path: 'room',
    router: roomRouter,
  },
];
