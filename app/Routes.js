import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes';
import App from './containers/App';
import HomePage from './containers/HomePage';
import TranslatePage from './containers/TranslatePage';

export default () => (
  <App>
    <Switch>
      <Route path={routes.TRANSLATE.path} component={TranslatePage} />
      <Route path={routes.HOME.path} exact component={HomePage} />
    </Switch>
  </App>
);
