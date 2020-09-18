import React, { useState } from 'react';
import { Route, useHistory } from "react-router";
import { Container, Link, Typography } from "@material-ui/core";
import { Link as RouterLink } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { gql, useQuery } from "@apollo/client";
import { getRandomPage } from "../graphql/getRandomPage";
import Routes from '../routes';

function Status({ code, children }) {
  return (
    <Route
      render={({ staticContext }) => {
        if (staticContext) {
          staticContext.statusCode = code;
        }
        return children;
      }}
    />
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    textSpacing: {
      marginBottom: theme.spacing(1.5)
    },
    centered: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      minHeight: '80vh'
    },
    block: {
      display: "block"
    },
    helpful: {
      fontSize: "1.2rem"
    }
  })
);

const GET_RANDOM = gql`
    query getRandomPage {
        getRandomPage {
            title
        }
    }
`;

export default function NotFound() {
  const classes = useStyles();
  const history = useHistory();
  const { data } = useQuery<getRandomPage>(GET_RANDOM);
  let random = '';
  if (data && data.getRandomPage) {
    random = data.getRandomPage.title;
  }

  return (
    <Status code={404}>
      <Container maxWidth="md" className={classes.centered}>
        <Typography variant="h4" className={classes.textSpacing}>
          We can't seem to find the page you're looking for.
        </Typography>
        <Typography variant="subtitle1" color="secondary" className={`${classes.textSpacing} ${classes.helpful}`}>
          Error Code: 404
        </Typography>
        <Typography variant="subtitle1" className={classes.helpful}>
          Here are some helpful links:
        </Typography>
        <Typography>
          <Link component={RouterLink} to={Routes.index.path} className={classes.block}>
            Search
          </Link>
          <Link component={RouterLink} to={Routes.wiki.path} className={classes.block}>
            Visit Showcase
          </Link>
          <Link component={RouterLink} to={Routes.wiki.path} className={classes.block}>
            Random Article
          </Link>
        </Typography>
      </Container>
    </Status>
  )
}