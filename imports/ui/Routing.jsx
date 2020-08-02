import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { mount } from 'react-mounter';
import { Wiki } from './Wiki';
import React from 'react';
import { Index } from './Index'
import { Container } from '@material-ui/core';

export const Routing = ({content}) => {
  return (
  <Container maxWidth={"md"}>
    <main>
      {content}
    </main>
  </Container>
  );
}

FlowRouter.route('/', {
  name: 'index',
  action() {
    mount(Routing, {
      content: <Index/>
    });
  },
});

FlowRouter.route('/wiki', {
  name: 'testing',
  action() {
    mount(Routing, {content: <Wiki/>});
  },
});