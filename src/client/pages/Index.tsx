import React from 'react';
import Routes from '../routes';
import REditor from "../components/REditor";
import { Container } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';

export const Index = () => (
  <CssBaseline>
    <Container maxWidth={"lg"}>
      <div>
        <h1>Welcome to the Wiki</h1>
        {/** Only using null assertion here because we know this path exists */}
        <a href={Routes.find(route => route.routeName == 'wiki')!.path}>Wiki</a>

        <div id={"editor"}>
          <REditor/>
        </div>


      </div>
    </Container>
  </CssBaseline>
);