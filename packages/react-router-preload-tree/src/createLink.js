// @flow

import { createLink as createLinkBase } from 'react-router-preload-core';
import { preloadTree } from 'react-preload-core';

export default function createLink(preloadVisitorFns: Array<Function> = []) {
  return createLinkBase((rootElement, rootContext) =>
    preloadTree(rootElement, rootContext, true, preloadVisitorFns),
  );
}
