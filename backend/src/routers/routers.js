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

// todo: only enables these routes in test mode
routes.push({
  path: 'test',
  router: testRouter,
});

export default routes;
