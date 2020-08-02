import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { Routing } from '../imports/ui/Routing';

Meteor.startup(() => {
  render(<Routing/>, document.getElementById('react-target'));
});
