import 'babel-polyfill';

import './reset.scss';
import './styles.scss';

import ReactDOM from 'react-dom';
import React, { Fragment } from 'react';
import { Switch, Route } from 'react-router';
import { HashRouter, Link } from 'react-router-dom';
import { makeAsyncRouter } from 'react-router-preload';
import { withPreloading } from 'react-preload-core';

const HomePage = () => 'Hello world!';
const SyncPage = () => 'Sync page';
const AsyncPageSlow = withPreloading(() => {
  return new Promise(resolve => {
    setTimeout(() => resolve(), 1000);
  });
})(() => 'Async slow');

const AsyncPageVerySlow = withPreloading(() => {
  return new Promise(resolve => {
    setTimeout(() => resolve(), 3000);
  });
})(() => 'Async very slow');

const AsyncRouter = makeAsyncRouter(HashRouter);

const App = () => (
  <AsyncRouter>
    <Fragment>
      <Link to="/">Home</Link>
      <Link to="/sync">Sync</Link>
      <Link to="/async-slow">Async Slow</Link>
      <Link to="/async-very-slow">Async Very Slow</Link>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/sync" component={SyncPage} />
        <Route path="/async-slow" component={AsyncPageSlow} />
        <Route path="/async-very-slow" component={AsyncPageVerySlow} />
      </Switch>
    </Fragment>
  </AsyncRouter>
);

ReactDOM.render(<App />, document.getElementById('app'));
