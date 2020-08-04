'use strict';
import { Wiki } from '/imports/ui/Wiki';
import { Index } from '/imports/ui/Index'

const Routes = {
  wikiMain: {
    routeName: 'wiki',
    path: '/wiki',
    component: Wiki
  },
  index: {
    routeName: 'index',
    path: '/',
    component: Index
  },
}

export default Routes;
