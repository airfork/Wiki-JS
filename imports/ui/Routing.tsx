// @ts-ignore
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
// @ts-ignore
import { mount } from 'react-mounter';
import React from 'react';
import { Container } from '@material-ui/core';
import Routes from '/imports/api/RoutePaths'

// @ts-ignore
export const Routing = ({content}) => {
  return (
  <Container maxWidth={"md"}>
    <main>
      {content}
    </main>
  </Container>
  );
}

FlowRouter.route(Routes.index.path, {
  name: Routes.index.routeName,
  action() {
    mount(Routing, {
      content: <Routes.index.component/>
    });
  },
});

FlowRouter.route(Routes.wikiMain.path, {
  name: Routes.wikiMain.routeName,
  action() {
    mount(Routing, {
      content: <Routes.wikiMain.component/>
    });
  },
});