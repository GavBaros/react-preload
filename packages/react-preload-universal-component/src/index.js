// @flow

import { withPreloading as doPreload } from 'react-preload-core';

export const withPreloading = doPreload(element => {
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
