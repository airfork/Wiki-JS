import Index from "./pages/Index";
import { Login } from "./pages/Login";
import Showcase from "./pages/Showcase";
import NewArticle from "./pages/NewArticle";
import { SignUp } from './pages/SignUp';
import React from "react";
import ViewArticle from "./pages/VewArticle";
import AdminPage from "./pages/AdminPage";

// type Route = {
//   routeName: string,
//   path: string,
//   component: () => JSX.Element,
// }

class Route {
  constructor(readonly path: string, readonly component: React.FunctionComponent) {
    this.path = path;
    this.component = component;
  }
}

const Routes = {
  wiki: new Route('/wiki', Showcase),
  index: new Route('/', Index),
  login: new Route('/login', Login),
  signup: new Route('/signup', SignUp),
  create: new Route('/wiki/create', NewArticle),
  title: new Route('/wiki/:title', ViewArticle),
  admin: new Route('/admin', AdminPage),
}

export default Routes;