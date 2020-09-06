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
  post: getPages_getPages,
}

export default function FeaturedPost(props: FeaturedPostProps) {
  const classes = useStyles();
  const { post } = props;
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
          <div className={classes.cardDetails}>
            <CardContent>
              <Typography component="h2" variant="h5">
                {post.title}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {updatedAt}
              </Typography>
              <Typography variant="subtitle1" paragraph>
                {post.contents}
              </Typography>
              <Typography variant="subtitle1" color="primary">
                Continue reading...
              </Typography>
            </CardContent>
          </div>
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