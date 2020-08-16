import { Wiki } from './pages/Wiki';
import { Index } from './pages/Index';
import { Login } from "./pages/Login";
import Showcase from "./pages/Showcase";
import NewArticle from "./pages/NewArticle";

// type Route = {
//   routeName: string,
//   path: string,
//   component: () => JSX.Element,
// }

class Route {
  constructor(readonly routeName: string, readonly path: string, readonly component: () => JSX.Element) {
    this.routeName = routeName;
    this.path = path;
    this.component = component;
  }
}

const Routes: Array<Route> = [
  new Route('wiki', '/wiki', Showcase),
  new Route('index', '/', Index),
  new Route('login', '/login', Login),
  new Route('newArticle', '/wiki/create', NewArticle)
];

export default Routes;