import React, { useState } from 'react';
import Routes from '../routes';
import { Button, Container, Typography } from '@material-ui/core';
import SearchBar from "material-ui-search-bar";
import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

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
    bottomPadding: {
      paddingBottom: "1rem"
    },
  }),
);

export default function Index() {
  const [value, setValue] = useState('');
  const classes = useStyles();

  return (
    <Container maxWidth={"lg"}>
      <div>
        <Container maxWidth={"sm"}>
          <Grid container spacing={2} justify={"center"} className={`${classes.centered}`}>
            <Grid item xs={12}>
              <Typography variant="h2" className={`${classes.alignCenter} ${classes.bottomPadding}`}>
                WikiName
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <SearchBar
                value={value}
                onChange={(newValue) => setValue(newValue)}
                onRequestSearch={() => console.log(`Search value: ${value}`)}
              />
            </Grid>
            <Grid item xs={12} className={`${classes.alignCenter}`}>
              <Button
                  color="secondary"
                  href={Routes.find(route => route.routeName == 'wiki')!.path}
              >
                Visit Showcase
              </Button>
            </Grid>
          </Grid>
        </Container>
      </div>
    </Container>
  );
}