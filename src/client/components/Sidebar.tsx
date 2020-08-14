import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { RelatedArticle } from "../types";

const useStyles = makeStyles((theme) => ({
  sidebarAboutBox: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[200],
  },
  sidebarSection: {
    marginTop: theme.spacing(3),
  },
}));

export default function Sidebar(props) {
  const classes = useStyles();
  const { related } = props;

  return (
    <Grid item xs={12} md={4}>
      <Typography variant="h6" gutterBottom className={classes.sidebarSection}>
        Related Articles
      </Typography>
      {related.map((relatedArticle: RelatedArticle) => (
        <Link display="block" variant="body1" href={relatedArticle.url} key={relatedArticle.title}>
          {relatedArticle.title}
        </Link>
      ))}
    </Grid>
  );
}

Sidebar.propTypes = {
  related: PropTypes.array,
};