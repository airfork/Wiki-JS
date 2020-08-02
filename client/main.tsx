import React from 'react';
// @ts-ignore
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { Routing } from '/imports/ui/Routing';

Meteor.startup(() => {
  // @ts-ignore
  render(<Routing/>, document.getElementById('react-target'));
});
