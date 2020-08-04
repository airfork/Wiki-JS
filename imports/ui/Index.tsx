import React from 'react';
import Routes from '/imports/api/RoutePaths'

export const Index = () => (
  <div>
    <h1>Welcome to the Wiki</h1>
    <a href={Routes.wikiMain.path}>Wiki</a>
  </div>
);