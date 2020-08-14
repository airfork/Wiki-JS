import { Wiki } from './pages/Wiki';
import { Index } from './pages/Index';
import { Login } from "./pages/Login";
import Showcase from "./pages/Showcase";
import Search from "./pages/Search";

type Route = {
  routeName: string,
  path: string,
  component: () => JSX.Element,
}

const Routes: Array<Route> = [
  {
    routeName: 'wiki',
    path: '/wiki',
    component: Showcase,
  },
  {
    routeName: 'index',
    path: '/',
    component: Index,
  },
  {
    routeName: 'login',
    path: '/login',
    component: Login,
  },
  {
    routeName: 'search',
    path: '/terr/search',
    component: Search,
  },

];

export default Routes;