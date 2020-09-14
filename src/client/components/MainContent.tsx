import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Markdown from './Markdown';
import { getFavorites_getFavorites } from "../graphql/getFavorites";
import sanitizeHtml from "sanitize-html";

const useStyles = makeStyles((theme) => ({
  bottomSpacing: {
    marginBottom: "1rem"
  },
}));

type MainContextProps = {
  fav: getFavorites_getFavorites,
  title: string,
}

export default function Main(props: MainContextProps) {
  const classes = useStyles();
  const { fav, title } = props;

  return (
    <Grid item xs={12} md={8}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Divider className={classes.bottomSpacing} />
      {fav?.page &&
      <Typography variant="body1" dangerouslySetInnerHTML={{ __html: sanitizeHtml(fav.page.contents) }}/>
      }
    </Grid>
  );
}