import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Markdown from './Markdown';
import { getFavorites_getFavorites } from "../graphql/getFavorites";

const useStyles = makeStyles((theme) => ({
  markdown: {
    ...theme.typography.body2,
    padding: theme.spacing(3, 0),
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
      <Divider />
      {fav?.page.contents}
    </Grid>
  );
}