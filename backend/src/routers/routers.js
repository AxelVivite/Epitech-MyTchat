import config from '../config';
import loginRouter from './login';
import roomRouter from './room';
import testRouter from './test';

const routes = [
  {
    path: 'login',
    router: loginRouter,
  },
  {
    path: 'room',
    router: roomRouter,
  },
];

if (config.env === 'dev' || config.env === 'test') {
  routes.push({
    path: 'test',
    router: testRouter,
  });
}

export default routes;
