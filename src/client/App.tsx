import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Routes from './routes';

export default function App() {
  return (
    <Router>
      <Switch>
        {Routes.map(route => (
          <Route path={route.path} key={route.routeName} exact>
            {React.createElement(route.component)}
          </Route>
        ))}
      </Switch>
    </Router>
  );
}