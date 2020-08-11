import React from 'react';
import Routes from '../routes';
import REditor from "../components/REditor";
import { Container } from '@material-ui/core';

export const Index = () => (
  <div>
    <h1>Welcome to the Wiki</h1>
    {/** Only using null assertion here because we know this path exists */}
    <a href={Routes.find(route => route.routeName == 'wiki')!.path}>Wiki</a>

    <Container maxWidth = "md">
      <div id={"editor"}>
        <REditor/>
      </div>

    </Container>


  </div>

);