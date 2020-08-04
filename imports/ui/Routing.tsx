// @ts-ignore
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import React from 'react';
// @ts-ignore
import { mount } from "react-mounter";
import { Container } from '@material-ui/core';
import Routes from '/imports/api/RoutePaths'

export type RoutingArgs = {
  content: () => JSX.Element,
}

export const Routing = ({content: Content}: RoutingArgs) => {
  return (
    <Container maxWidth={"md"}>
      <main>
        <Content />
      </main>
    </Container>
  );
}

Routes.forEach(route => {
  FlowRouter.route(route.path, {
    name: route.routeName,
    action() {
      mount(Routing, {content: route.component})
    }
  })
});