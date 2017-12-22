// @flow

import React from 'react';
import { Switch } from 'react-router';
import { StaticRouter } from 'react-router-dom';
import { walkTreeAndPreload } from 'react-preload-core';

const Wrapper = ({ children }) => children;

async function doPreloadRoute(
  href: string,
  component: React$Element<any>,
  options: ?Object,
) {
  const context = {};
  const element = (
    <StaticRouter location={href} context={context}>
      <Wrapper>{component}</Wrapper>
    </StaticRouter>
  );

  await walkTreeAndPreload(element, {}, true, options);

  // The url property of the router context is set if the app
  // was redirected during preloading.
  return context.url;
}

export async function preloadRoute(
  href: string,
  component: React$Element<any>,
  options: ?Object,
) {
  const redirect = await doPreloadRoute(href, component, options);

  // In case of a redirect we need to also preload the next route.
  if (typeof redirect !== 'undefined' && typeof redirect === 'string') {
    await doPreloadRoute(redirect, component);
  }
}
