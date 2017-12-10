// @flow

export default function preloadTreeApollo(element, instance, context) {
  // Check if the current component is an Apollo query wrapper.
  if (instance && typeof instance.fetchData === 'function') {
    // Execute the graphql query for this component.
    const fetch = instance.fetchData();

    if (fetch && fetch.then && typeof fetch.then === 'function') {
      return fetch;
    }
  }
}
