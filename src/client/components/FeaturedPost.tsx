import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Hidden from '@material-ui/core/Hidden';
import { Post } from '../pages/Showcase';
import { getPages_getPages } from "../graphql/getPages";
import { getFavorites_getFavorites } from "../graphql/getFavorites";

const useStyles = makeStyles({
  card: {
    display: 'flex',
  },
  cardDetails: {
    flex: 1,
  },
  cardMedia: {
    width: 160,
  },
});

type FeaturedPostProps = {
  fav: getFavorites_getFavorites,
}

export default function FeaturedPost(props: FeaturedPostProps) {
  const classes = useStyles();
  const { fav } = props;
  const post = fav.page;
  let updatedAt = ''
  if (post.updatedAt) {
    const updatedDate = new Date(post.updatedAt);
    const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit' })
    const [{ value: month }, , { value: day }, , { value: year }] = dateTimeFormat.formatToParts(updatedDate)
    updatedAt = `${month}, ${day} ${year}`;
  }

  return (
    <Grid item xs={12} md={6}>
      <CardActionArea component="a" href="#">
          <Card className={classes.card}>
            <Grid container spacing={5} className={classes.cardDetails}>
              <Grid item xs={12}>
                <CardContent>
                  <Typography component="h2" variant="h5" noWrap={true}>
                    {post.title}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    {updatedAt}
                  </Typography>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" paragraph>
                      {post.contents.substr(0,200) + '...'}
                    </Typography>
                  </Grid>
                  <Typography variant="subtitle1" color="primary">
                    Continue reading...
                  </Typography>
                </CardContent>
              </Grid>
            </Grid>
            {/*<Hidden xsDown>*/}
            {/*  {post.image*/}
            {/*  ? <CardMedia className={classes.cardMedia} image={post.image} title={post.imageTitle} />*/}
            {/*  : <p/>*/}
            {/*  }*/}
            {/*</Hidden>*/}
          </Card>
      </CardActionArea>
    </Grid>
  );
}