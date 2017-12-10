// @flow

import { renderToString } from 'react-dom/server';
import preloadTree from './preloadTree';

export default function renderToStringWithPreload(
  rootComponent: React$Element<any>,
  preloadFns: Array<Function> = [],
): Promise<string> {
  return preloadTree(rootComponent, {}, true, preloadFns).then(() =>
    renderToString(rootComponent),
  );
}
