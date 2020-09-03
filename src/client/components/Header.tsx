import React from 'react';
import { createStyles, fade, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home'
import WikiSearch from './WikiSearch';
import { useQuery, useMutation } from '@apollo/client';
import { isLoggedIn } from '../graphql/isLoggedIn';
import { IS_LOGGED_IN, LOG_OUT, client } from '../main';
import { logOut } from '../graphql/logOut';

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
    searchInput: {
      color: 'inherit',
    },
    search: {
      color: 'inherit',
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginLeft: 0,
      marginRight: theme.spacing(1),
      height: '3em',
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
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
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
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


export default function Header() {
  const classes = useStyles();
  const { data, refetch } = useQuery<isLoggedIn>(IS_LOGGED_IN);
  const [logOut] = useMutation<logOut>(LOG_OUT);

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
          <WikiSearch
            inputClass={classes.searchInput}
            mainClass={classes.search}
            iconButtonClass={classes.searchInput}
          />
          {
            data?.isLoggedIn
              ? <div>
                  <Button color="inherit" href="/wiki/create">Create</Button>
                  <Button color="inherit"
                          onClick={async () => { await logOut(); await client.resetStore(); }}>
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