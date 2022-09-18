import loginRouter from './login';
import roomRouter from './room';

// todo: better params/headers/body error handling
// https://joi.dev/api/?v=17.6.0

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
