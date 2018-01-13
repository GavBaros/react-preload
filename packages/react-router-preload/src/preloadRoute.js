// @flow

import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { walkTreeAndPreload } from 'react-preload-core';

const Wrapper = ({ children }) => children;

export function preloadRoute(
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

  return walkTreeAndPreload(element, {}, true, options).then(() => {
    // In case of a redirect we need to also preload the next route.
    if (typeof context.url !== 'undefined' && typeof context.url === 'string') {
      return preloadRoute(context.url, component, options);
    }
  });
}
