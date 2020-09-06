import React from 'react';
import { Route } from "react-router";
import { Container, Link, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

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

export default function NotFound() {
  const classes = useStyles();

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
          <Link href="/" className={classes.block}>
            Search
          </Link>
          <Link href="/wiki" className={classes.block}>
            Visit Showcase
          </Link>
          <Link href="#" className={classes.block}>
            Random Article
          </Link>
        </Typography>
      </Container>
    </Status>
  )
}