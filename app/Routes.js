import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes';
import App from './containers/App';
import HomePage from './containers/HomePage';
import TranslatePage from './containers/TranslatePage';
import NotePage from './containers/NotePage';
import DictPage from './containers/DictPage';

export default () => (
  <App>
    <Switch>
      <Route path={routes.TRANSLATE.path} component={TranslatePage} />
      <Route path={routes.HOME.path} exact component={HomePage} />
      <Route path={routes.NOTE.path} exact component={NotePage} />
      <Route path={routes.DICTS.path} exact component={DictPage} />
    </Switch>
  </App>
);
