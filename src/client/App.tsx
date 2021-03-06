import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Routes from './routes';
import { createMuiTheme, CssBaseline, ThemeProvider, useMediaQuery } from '@material-ui/core';
import { ApolloProvider } from '@apollo/client';
import { client } from './main';
import ErrorPage from "./pages/ErrorPage";
import { GlobalOperations } from './components/GlobalOperations';


export default function App() {

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const Theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
          primary: {
            // light: will be calculated from palette.primary.main,
            main: '#78909c',
            light: '#a7c0cd',
            dark: '#4b636e',
            // dark: will be calculated from palette.primary.main,
            // contrastText: will be calculated to contrast with palette.primary.main
          },
          secondary: {
            main: '#ff80ab',
            light: '#ffb2dd',
            dark: '#c94f7c'
            // dark: will be calculated from palette.secondary.main,
          },
          // Used by `getContrastText()` to maximize the contrast between
          // the background and the text.
          contrastThreshold: 3,
          // Used by the functions below to shift a color's luminance by approximately
          // two indexes within its tonal palette.
          // E.g., shift from Red 500 to Red 300 or Red 700.
          tonalOffset: 0.2,
        },

      }),
    [prefersDarkMode],
  );

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={Theme}>
        <GlobalOperations>
          <CssBaseline />
          <Router>
            <Switch>
              {Object.entries(Routes).map(([routeName, route]) => (
                <Route path={route.path} key={routeName} exact component={route.component} />
              ))}
              <Route component={ErrorPage} />
            </Switch>
          </Router>
        </GlobalOperations>
      </ThemeProvider>
    </ApolloProvider>
  );
}