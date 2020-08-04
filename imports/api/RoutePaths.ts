'use strict';
import { Wiki } from '/imports/ui/Wiki';
import { Index } from '/imports/ui/Index'

class Route {
  readonly routeName: String;
  readonly path: String;
  readonly component: () => JSX.Element;

  constructor(routeName: String, path: String, component: () => JSX.Element) {
    this.routeName = routeName;
    this.path = path;
    this.component = component;
  }
}

const Routes = {
  wikiMain: new Route('wiki', '/wiki', Wiki),
  index: new Route('index', '/', Index),
}

export default Routes;
