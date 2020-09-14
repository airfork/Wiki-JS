import React from "react";
import { gql, useQuery } from "@apollo/client";
import { getPage } from "../graphql/getPage";
import NotFound from "./NotFound";
import Header from "../components/Header";
import { Container, Grid, Typography } from "@material-ui/core";
import CreateFab from "../components/CreateFab";
import { RelatedArticle } from "../types";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import sanitizeHtml from 'sanitize-html';
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    topSpacing: {
      marginTop: "2rem"
    },
    bottomSpacing: {
      marginBottom: "1rem"
    },
  }),
);

const GET_PAGE = gql`
    query getPage($title: String!) {
        getPage(title: $title) {
            contents,
            createdAt,
            title
        }
    }
`;

const relatedArticles: Array<RelatedArticle> = [
  { title: 'Related post 1', url: '#' },
  { title: 'Related post 2', url: '#' },
  { title: 'Related post 3', url: '#' },
]

export default function ViewArticle(props) {
  const classes = useStyles();
  const title = props.match.params.title;

  const { loading, error, data } = useQuery<getPage>(GET_PAGE, {
    variables: { title },
  });

  if(!loading && !data?.getPage) {
    return <NotFound/>;
  }

  return(
    <div>
      <Header/>
      <Container maxWidth="lg" className={classes.topSpacing}>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <Typography variant="h2">
              {data?.getPage?.title}
            </Typography>
            <Divider className={classes.bottomSpacing} />
            {data?.getPage &&
            <Typography variant="body1" dangerouslySetInnerHTML={{ __html: sanitizeHtml(data.getPage.contents) }}/>
            }
          </Grid>
        </Grid>
      </Container>
      <CreateFab/>
    </div>
  )
}