// @flow

import { graphql as graphqlOriginal } from 'react-apollo';
import { withPreloading } from 'react-preload-core';

export const graphql = (query: any, options: any = {}) => {
  const withPreloadedQuery = withPreloading((element, instance) => {
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

  return (component: React$Element<any>) =>
    withPreloadedQuery(graphqlOriginal(query, options)(component));
};
