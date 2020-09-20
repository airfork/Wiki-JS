import React, { useState } from 'react';
import Routes from '../routes';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import WikiSearch from '../components/WikiSearch';
import { Link, useHistory } from 'react-router-dom';
import { gql, useQuery } from "@apollo/client";
import { randomPage } from "../graphql/randomPage";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    small: {
      textAlign: 'right'
    },
    centered: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
      minHeight: '90vh'
    },
    alignCenter: {
      textAlign: 'center'
    },
    alignRight: {
      textAlign: "right"
    },
    alignLeft: {
      textAlign: "left"
    },
    bottomPadding: {
      paddingBottom: "1rem"
    },
  }),
);

const GET_RANDOM = gql`
    query randomPage {
        getRandomPage {
            title
        }
    }
`;

export default function Index() {
  const classes = useStyles();
  const { data, refetch } = useQuery<randomPage>(GET_RANDOM);
  const history = useHistory();
  let random = '';
  if (data && data.getRandomPage) {
    random = data.getRandomPage.title;
  }

  return (
    <Container maxWidth={"lg"}>
      <div>
        <Container maxWidth={"sm"}>
          <Grid container spacing={2} justify="center" className={`${classes.centered}`}>
            <Grid item xs={12}>
              <Typography variant="h2" className={`${classes.alignCenter} ${classes.bottomPadding}`}>
                WikiName
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <WikiSearch />
            </Grid>
            <Grid item xs={12}>
              <Grid container justify="space-between">
                <Grid item xs={6} className={classes.alignLeft}>
                  <Button
                    color="secondary"
                    component={Link}
                    to={Routes.wiki.path}
                  >
                    Visit Showcase
                  </Button>
                </Grid>
                <Grid item xs={6} className={classes.alignRight}>
                  <Button
                    color="secondary"
                    onClick={() => {
                      history.push(`${Routes.wiki.path}/${random}`);
                      refetch();
                    }}
                  >
                    Something Interesting
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </div>
    </Container>
  );
}