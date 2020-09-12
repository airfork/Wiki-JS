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
import { getFavorites, getFavorites_getFavorites } from "../graphql/getFavorites";
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
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed',
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

const GET_FAVORITES = gql`
  query getFavorites {
    getFavorites {
      page {
          title
          contents
          updatedAt
      }
    }
  }
`;

let mainFeaturedPost: getFavorites_getFavorites;
let firstFeatured: getFavorites_getFavorites;
let secondFeatured: getFavorites_getFavorites;
let longFeatured: getFavorites_getFavorites;

const relatedArticles: Array<RelatedArticle> = [
  { title: 'Related post 1', url: '#' },
  { title: 'Related post 2', url: '#' },
  { title: 'Related post 3', url: '#' },
]

export default function Showcase() {
  const classes = useStyles();
  const { loading, data } = useQuery<getFavorites>(GET_FAVORITES);
  const { data: userData, refetch } = useQuery<isLoggedIn>(IS_LOGGED_IN);
  const history = useHistory();
  if (!loading) {
    if (data) {
      [mainFeaturedPost, firstFeatured, secondFeatured, longFeatured] = data.getFavorites;
    }
  }

  return (
    <>
      <CssBaseline />
      <Header logoutAction={refetch} />
      <Container maxWidth="xl">
        <main>
          {mainFeaturedPost && <MainFeaturedPost fav={mainFeaturedPost} />}
          <Grid container spacing={4}>
            {firstFeatured &&
              <FeaturedPost key={firstFeatured.page.title} fav={firstFeatured} />
            }
            {secondFeatured &&
              <FeaturedPost key={secondFeatured.page.title} fav={secondFeatured} />
            }
          </Grid>
          <Grid container spacing={5} className={classes.mainGrid}>
            {longFeatured && <Main title={longFeatured?.page.title} fav={longFeatured} />}
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
