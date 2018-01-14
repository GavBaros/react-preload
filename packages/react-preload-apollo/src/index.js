// @flow

import { withPreloading as doPreload } from 'react-preload-core';

export const withPreloading = doPreload((element, instance) => {
  // Check if the current component is an Apollo query wrapper.
  if (instance && typeof instance.fetchData === 'function') {
    // Execute the graphql query for this component.
    const fetch = instance.fetchData();

    if (fetch && fetch.then && typeof fetch.then === 'function') {
      return fetch;
    }
  }

  return true;
});
