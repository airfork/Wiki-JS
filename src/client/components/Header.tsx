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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
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
      backgroundClip: 'content-box',
      paddingRight: theme.spacing(2),
      width: theme.spacing(30),
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
      },
    },
    rightSide: {
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
      },
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
  }),
);

type HeaderProps = {
  logoutAction?: () => void,
}

export default function Header(props: HeaderProps) {
  const classes = useStyles();
  const { data, refetch } = useQuery<isLoggedIn>(IS_LOGGED_IN);

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" href="/">
            <HomeIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            Wiki
          </Typography>
          <div>
            <WikiSearch
              mainClass={classes.search}
              searchSize="dense"
            />
          </div>
          {
            data?.isLoggedIn
              ? <div>
                <Button color="inherit"
                  onClick={() => { logout(); refetch(); props.logoutAction?.(); }}>
                  Logout
                  </Button>
              </div>
              : <Button color="inherit" href="/login">Login</Button>
          }
        </Toolbar>
      </AppBar>
    </div>
  );
}