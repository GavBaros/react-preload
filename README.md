# React Preload

Preload a component tree in the background before rendering it.

[![Travis](https://img.shields.io/travis/fubhy/react-preload.svg)](https://travis-ci.org/fubhy/react-preload)

## Concept

When building React applications with asynchronous run-time dependencies
(e.g. data fetching, lazily loaded code chunks, etc.) you might want
to preload all or some of these dependencies during server-side rendering
or before route transitions.

This library tries to solve this problem by utilizing the excellent
`react-tree-walker` project to detect components with asynchronous
dependencies and resolve these in the background before rendering.

This means that any component, however deep it might be nested in the
rendering tree, can define a preloading mechanism on its own.

Preloading is recursive, meaning that you can have a preloaded graphql
query inside of a lazy loaded component (code splitting).

## Usage

### Mark components

First you need to mark your components for preloading. You can do this
very easily by adding a ``preloadComponent`` method to your component.

Let's assume you have a component that fetches data from a remote API
when mounted:

```js
class MyDataFetchingComponent extends React.Component {
  // Automatically invoked by the react-tree-walker visitor.
  preloadComponent = () => {
    if (this.state.hasData) {
      // Data has already been preloaded.
      return true;
    }

    // Return the promise for fetching the data. The tree walker
    // will continue with the sub-tree once loading has finished.
    return this.fetchData();
  }

  fetchData = () => {
    // Return the promise for the fetch operation.
    return fetch('http://my.api.com')
      .then((res) => res.json())
      .then((json) => /* ... */);
  }

  // ...
}
```

It's also possible to decorate your existing components or components
from external libraries elegantly using a higher-order component.

```js
import { graphql } from 'react-apollo';
import { withPreloading } from 'react-preload-core';

const MyComponent = (props) => (
  // ...
);

const withDataPreloading = withPreloading((element, instance, context, options) => {
  // Execute the graphql query for this component.
  const fetch = instance.fetchData();
  if (fetch && fetch.then && typeof fetch.then === 'function') {
    return fetch;
  }

  return true;
});

const withData = graphql(gql`
  me {
    name
  }
`);

export default compose(
  withDataPreloading,
  withData,
)(MyComponent);
```

This package comes with pre-defined decorators for common use-cases such as for
react-apollo. You can therefore simplify the previous by installing the contained ``react-preload-apollo`` utility.

```js
import { graphql } from 'react-apollo';
import { withPreloading } from 'react-preload-apollo';

const MyComponent = (props) => (
  // ...
);

const withData = graphql(gql`
  me {
    name
  }
`);

export default withPreloading(withData(MyComponent));
```

I am going to add more decorators for common scenarios in the future.

### Server Side Rendering

We can use this approach to resolve asynchronous dependencies during
server-side rendering before passing our component tree to
``renderToString``.

```js
import { renderToString } from 'react-dom/server';
import { walkTreeAndPreload } from 'react-preload-core';
import App from './components/App';

// ...

walkTreeAndPreload(App)
  .then(() => renderToString(App))
  .then((output) => res.send(output));
```

### Usage with React Router

```js
import { BrowserRouter, Link } from 'react-router-dom';
import { Switch, Route } from 'react-router';
import { withPreloading } from 'react-router-preload';

// The async router will delay route transitions (rendering of the 
// router's children for the next location) until the dependencies of
// the next location's component tree are resolved.
const AsyncRouter = makeAsyncRouter(BrowserRouter);

// Synchronous page without any delay.
const HomePage = () => (
  <div>This page is rendered instantly</div>
);

// Asynchronous page with an artificial delay of 3 seconds.
const AsyncPage = withPreloading(() => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 3000);
  });
})(() => (
  <div>This page is rendered after a delay of 3 seconds.</div>
));

const App = () => (
  <AsyncRouter>
    <Fragment>
      <Link to="/">Home</Link>
      <Link to="/slow">Slow page</Link>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/async" component={AsyncPage} />
      </Switch>
    </Fragment>
  </AsyncRouter>
);
```

Let's assume you have got a project with code-splitting and graphql queries
that happens to use ``react-router`` for routing. Now, when transitioning
to a new route that requires a new code chunk to be downloaded, one graphql
query to be updated and one more to be issued based on the new code chunk.

Now, when the location change occurs, the component tree of the subsequent
target route will be preloaded in the background while the previously rendered
page remains visible. The tree walking is parallelized, hence the needed code
chunk and the first graphql query are resolved simultaneously. Because the
preloading process is recursive by default, the second graphql query will
be resolved after the new code chunk has been downloaded. Once all of the
recursive dependencies are resolved, the application transitions to the
new route.
