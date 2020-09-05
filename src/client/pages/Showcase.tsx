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

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    marginTop: theme.spacing(3),
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
  const {loading, error, data} = useQuery<getPages>(GET_PAGES);

  return (
    <>
      <CssBaseline />
      <Container maxWidth="xl">
        <Header />
        <main>
          <MainFeaturedPost post={mainFeaturedPost} />
          <Grid container spacing={4}>
            {!loading
            ?  data?.getPages.map((post) => (
                <FeaturedPost key={post?.title} post={post} />
              ))
              : null
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
    </>
  );
}
