// @flow

import universalOriginal from 'react-universal-component';
import { withPreloading } from 'react-preload-core';

const withPreloadedComponent = withPreloading(element => {
  // Check if the current component is a lazy component wrapper.
  if (element && element.type && typeof element.type.preload === 'function') {
    // Preload the component file.
    const preload = element.type.preload();

    if (preload && preload.then && typeof preload.then === 'function') {
      return preload;
    }
  }

  return true;
});

export const universal = (...args: Array<any>) =>
  withPreloadedComponent(universalOriginal(...args));
