import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Header from "../components/Header";
import MainFeaturedPost from "../components/MainFeaturedPost";
import FeaturedPost from "../components/FeaturedPost";
import Main from "../components/MainContent"
import Sidebar from "../components/Sidebar";
import { RelatedArticle } from "../types";
import { useQuery } from "@apollo/client";
import gql from 'graphql-tag';
import { getPages } from "../graphql/getPages";
import { isLoggedIn } from '../graphql/isLoggedIn';
import { IS_LOGGED_IN } from '../auth';
import { Fab, Tooltip } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { useHistory } from 'react-router';

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    marginTop: theme.spacing(3),
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

export type Post = {
  title: string,
  date: string,
  description: string,
  image?: string,
  imageTitle?: string,
  linkText?: string,
}

const GET_PAGES = gql`
  query getPages {
      getPages {
          title
          contents
          updatedAt
      }
  }
`;

const mainFeaturedPost: Post = {
  title: 'Title of a longer featured blog post',
  date: 'Nov 13',
  description:
    "Multiple lines of text that form the lede, informing new readers quickly and efficiently about what's most interesting in this post's contents.",
  linkText: 'Continue Reading'
};

const featuredPosts: Array<Post> = [
  {
    title: 'Featured post',
    date: 'Nov 12',
    description:
      'This is a wider card with supporting text below as a natural lead-in to additional content.',
  },
  {
    title: 'Post title',
    date: 'Nov 11',
    description:
      'This is a wider card with supporting text below as a natural lead-in to additional content.',
  },
];

const posts = [];

const relatedArticles: Array<RelatedArticle> = [
  { title: 'Related post 1', url: '#' },
  { title: 'Related post 2', url: '#' },
  { title: 'Related post 3', url: '#' },
]

export default function Showcase() {
  const classes = useStyles();
  const { loading, data } = useQuery<getPages>(GET_PAGES);
  const { loading: userLoading, data: userData, refetch } = useQuery<isLoggedIn>(IS_LOGGED_IN);
  const history = useHistory();

  return (
    <>
      <CssBaseline />
      <Header logoutAction={refetch} />
      <Container maxWidth="xl">
        <main>
          <MainFeaturedPost post={mainFeaturedPost} />
          <Grid container spacing={4}>
            {!loading &&
              data?.getPages.map((post) => (
                <FeaturedPost key={post.title} post={post} />
              ))
            }
          </Grid>
          <Grid container spacing={5} className={classes.mainGrid}>
            <Main title="C++20" posts={posts} />
            <Sidebar
              related={relatedArticles}
            />
          </Grid>
        </main>
      </Container>
      <Tooltip title="Create page">
        <Fab
          color="secondary"
          className={classes.fab}
          disabled={!userData?.isLoggedIn ?? true}
          onClick={() => history.push("/wiki/create")}>
          <AddIcon />
        </Fab>
      </Tooltip>
    </>
  );
}
