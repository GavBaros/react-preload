// @flow

import { withPreloading as doPreload } from 'react-preload-core';
import invariant from 'invariant';

export const withPreloading = doPreload((element, instance) => {
  invariant(
    !instance || typeof instance.fetchData !== 'function',
    'The decorated component has to be an apollo graphql query container.',
  );

  // Execute the graphql query for this component.
  const fetch = instance.fetchData();
  if (fetch && fetch.then && typeof fetch.then === 'function') {
    return fetch;
  }

  return true;
});
