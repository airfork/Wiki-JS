import React from 'react';
import Routes from '../routes';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import WikiSearch from '../components/WikiSearch';
import { Link } from 'react-router-dom';

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
              <WikiSearch />
            </Grid>
            <Grid item xs={12} className={`${classes.alignCenter}`}>
              <Button
                color="secondary"
                component={Link}
                to={Routes.find(route => route.routeName == 'wiki')!.path}
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