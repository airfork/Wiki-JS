import React from 'react';
import { createStyles, fade, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home'
import WikiSearch from './WikiSearch';
import { useQuery } from '@apollo/client';
import { isLoggedIn } from '../graphql/isLoggedIn';
import { IS_LOGGED_IN, logout } from '../auth';
import { Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useHistory } from "react-router";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.down('xs')]: {
        flexGrow: 1,
      }
    },
    title: {
      paddingTop: '20%',
      flexGrow: 1,
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
    search: {
      color: 'inherit',
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      width: theme.spacing(30),
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
      },
    },
    loginButton: {
      paddingLeft: theme.spacing(2),
    }
  }),
);

type HeaderProps = {
  logoutAction?: () => void,
}

export default function Header(props: HeaderProps) {
  const classes = useStyles();
  const { data, refetch } = useQuery<isLoggedIn>(IS_LOGGED_IN);
  const history = useHistory();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Grid container>
            <Grid item>
              <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                aria-label="menu"
                onClick={() => history.push('/')}
              >
                <HomeIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <Typography className={classes.title} variant="h6">
                Wiki
            </Typography>
            </Grid>
          </Grid>
          <WikiSearch
            mainClass={classes.search}
            searchSize="dense"
          />
          <div className={classes.loginButton}>
            {
              data?.isLoggedIn
                ?
                <Button color="inherit"
                  onClick={() => { logout(); refetch(); props.logoutAction?.(); }}>
                  Logout
                  </Button>
                : <Button color="inherit" component={Link} to="/login">Login</Button>
            }
          </div>
        </Toolbar>
      </AppBar>
    </div >
  );
}