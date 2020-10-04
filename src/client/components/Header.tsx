import React from 'react';
import { createStyles, fade, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home'
import SettingsIcon from '@material-ui/icons/Settings';
import WikiSearch from './WikiSearch';
import { useQuery } from '@apollo/client';
import { isLoggedIn } from '../graphql/isLoggedIn';
import { IS_LOGGED_IN, logout } from '../auth';
import { Avatar, Grid } from '@material-ui/core';
import { Link as RouterLink, Link } from 'react-router-dom';
import MenuIcon from "@material-ui/icons/Menu";
import Routes from "../routes";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    small: {
      width: theme.spacing(4),
      height: theme.spacing(4),
      marginLeft: "10px",
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.04)",
      }
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.down('xs')]: {
        flexGrow: 1,
      }
    },
    appBar: {
      [theme.breakpoints.up('sm')]: {
        // width: `calc(100% - ${drawerWidth}px)`,
        // marginLeft: drawerWidth,
        zIndex: theme.zIndex.drawer + 1,
      },
    },
    green: {
      color: '#fff',
      backgroundColor: theme.palette.primary.main,
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
  fixed?: boolean,
  toggle?: JSX.Element,
}

export default function Header(props: HeaderProps) {
  const classes = useStyles();
  const { data, refetch } = useQuery<isLoggedIn>(IS_LOGGED_IN);

  return (
    <div className={classes.root}>
      <AppBar position={props.fixed ? "fixed" : "static"} className={classes.appBar}>
        <Toolbar>
          {props.toggle ? props.toggle : null}
          <Grid container>
            <Grid item>
              <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                aria-label="menu"
                component={Link}
                to="/"
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
          {data?.isLoggedIn
          ?
            <Avatar className={`${classes.small} ${classes.green}`} component={Link} to={Routes.admin.path}>
              <SettingsIcon/>
            </Avatar>
          : null
          }
        </Toolbar>
      </AppBar>
    </div >
  );
}