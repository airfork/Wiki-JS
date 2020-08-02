import React from 'react';
import Routes from '/imports/api/RoutePaths'

export const Index = () => (
  <div>
    <h1>Welcome to Meteor!</h1>
    <a href={Routes.wikiMain}>Wiki</a>
  </div>
);