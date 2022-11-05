import Login from '../../components/views/Login';
import Home from '../../components/views/Tchat';
import { View } from '../../shared/interfaces';

const Views: View[] = [
  {
    path: '/sign-in',
    component: Login,
  },
  {
    path: '/',
    component: Home,
  },
  {
    path: '/test',
    component: Home,
  },
];

export default Views;
