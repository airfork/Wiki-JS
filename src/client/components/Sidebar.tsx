import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { RelatedArticle } from "../types";
import { Theme } from "../Theme";

const useStyles = makeStyles((theme) => ({
  sidebarSection: {
    marginTop: theme.spacing(3),
  },
}));

type SidebarProps = {
  related: Array<RelatedArticle>,
}

export default function Sidebar(props: SidebarProps) {
  const classes = useStyles(Theme);
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