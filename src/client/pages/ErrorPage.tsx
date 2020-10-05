import React from 'react';
import { Route } from "react-router";
import { Container, Link, Typography } from "@material-ui/core";
import { Link as RouterLink } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { gql, useQuery } from "@apollo/client";
import { getRandomPage } from "../graphql/getRandomPage";
import Routes from '../routes';
import { isLoggedIn } from "../graphql/isLoggedIn";
import { IS_LOGGED_IN } from "../auth";

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

type ErrorProps = {
  code?: number,
}

const errorMessages = {
  403: "You are not authorized to view this page.",
  404: "We can't seem to find the page you're looking for.",
}

export default function ErrorPage(props: ErrorProps) {
  const classes = useStyles();
  const { data } = useQuery<getRandomPage>(GET_RANDOM);
  const loginData = useQuery<isLoggedIn>(IS_LOGGED_IN);
  const loginStatus = loginData.data;
  let random = '';
  if (data && data.getRandomPage) {
    random = data.getRandomPage.title;
  }

  const statusCode = props.code ? props.code : 404;

  return (
    <Status code={404}>
      <Container maxWidth="md" className={classes.centered}>
        <Typography variant="h4" className={classes.textSpacing}>
          {errorMessages[statusCode]}
        </Typography>
        <Typography variant="subtitle1" color="secondary" className={`${classes.textSpacing} ${classes.helpful}`}>
          {`Error Code: ${statusCode}`}
        </Typography>
        <Typography variant="subtitle1" className={classes.helpful}>
          Here are some helpful links:
        </Typography>
        <Typography>
          {!loginStatus?.isLoggedIn
          ?
            <Link component={RouterLink} to={Routes.login.path} className={classes.block}>
              Login
            </Link>
          : null
          }
          <Link component={RouterLink} to={Routes.index.path} className={classes.block}>
            Search
          </Link>
          <Link component={RouterLink} to={Routes.wiki.path} className={classes.block}>
            Visit Showcase
          </Link>
          <Link component={RouterLink} to={`${Routes.wiki.path}/${random}`} className={classes.block}>
            Random Article
          </Link>
        </Typography>
      </Container>
    </Status>
  )
}