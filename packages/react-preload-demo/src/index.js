import 'babel-polyfill';

// Global styles.
import './reset.scss';
import './styles.scss';

import ReactDOM from 'react-dom';
import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { makeAsyncRouter } from 'react-router-preload';
import Home from './components/Home';
import Slow from './components/Slow';
import Navigation from './components/Navigation';
import Throbber from './components/Throbber';

const AsyncRouter = makeAsyncRouter(BrowserRouter);
const App = () => (
  <AsyncRouter
    basename={
      (process.env.NODE_ENV === 'production' && '/react-preload') || null
    }
  >
    <Fragment>
      <Throbber />

      <Navigation />

      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/slow" component={Slow} />
      </Switch>
    </Fragment>
  </AsyncRouter>
);

ReactDOM.render(<App />, document.getElementById('app'));
