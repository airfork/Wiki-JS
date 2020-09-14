import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import { getFavorites_getFavorites } from "../graphql/getFavorites";

const useStyles = makeStyles((theme) => ({
  mainFeaturedPost: {
    position: 'relative',
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.common.white,
    marginBottom: theme.spacing(4),
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,.3)',
  },
  mainFeaturedPostContent: {
    position: 'relative',
    padding: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(6),
      paddingRight: 0,
    },
  },
}));

type MainFeaturedPostProps = {
  fav: getFavorites_getFavorites
};

export default function MainFeaturedPost(props: MainFeaturedPostProps) {
  const classes = useStyles();
  const { fav } = props;
  const post = fav?.page;

  return (
    <Paper className={classes.mainFeaturedPost}>
      <div className={classes.overlay} />
      <Grid container>
        <Grid item xs={12} md={6} xl={8}>
          <div className={classes.mainFeaturedPostContent}>
            <Typography component="h1" variant="h3" color="inherit" gutterBottom style={{ wordBreak: 'break-word' }}>
              {post?.title.substr(0, 100)}
            </Typography>
            <Typography variant="h5" color="inherit" paragraph style={{ wordBreak: 'break-word' }}>
              {post?.contents.substr(0, 200) + '...'}
            </Typography>
            <Link variant="subtitle1" href="#">
              Continue Reading
            </Link>
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
}