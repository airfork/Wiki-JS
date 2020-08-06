import { Wiki } from './pages/Wiki';
import { Index } from './pages/Index';

type Route = {
  routeName: string,
  path: string,
  component: () => JSX.Element,
}

const Routes: Array<Route> = [
  {
    routeName: 'wiki',
    path: '/wiki',
    component: Wiki,
  },
  {
    routeName: 'index',
    path: '/',
    component: Index,
  }
];

export default Routes;