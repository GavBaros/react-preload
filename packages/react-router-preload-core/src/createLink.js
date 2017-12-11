// @flow

import React from 'react';
import { createLocation } from 'history';
import { Link, StaticRouter } from 'react-router-dom';
import { PreloaderPropType } from './preloaderContext';

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

export function createLink(preloadCb: Function) {
  function createPreloader(targetHref: string, linkProps: Object) {
    return async function doPreload(containerProps: Object) {
      const routerContext = {};
      const rootElement = (
        <StaticRouter location={targetHref} context={routerContext}>
          {containerProps.children}
        </StaticRouter>
      );

      await preloadCb(rootElement, targetHref, linkProps, containerProps);

      // If the app was redirected during preloading, we need to
      // also preload the next route.
      if (routerContext.url) {
        await doPreload(routerContext.url, containerProps);
      }
    };
  }

  return class AsyncLink extends Link {
    static contextTypes = {
      ...Link.contextTypes,
      preloader: PreloaderPropType,
    };

    handleClick = async event => {
      if (this.props.onClick) {
        this.props.onClick(event);
      }

      // Let browser handle target blank etc.
      if (this.props.target) {
        return;
      }

      // Ignore if custom click handler prevented the default behavior or this was
      // not a plain left click (without any modifiers).
      if (
        !event.defaultPrevented &&
        event.button === 0 &&
        !isModifiedEvent(event)
      ) {
        event.preventDefault();

        const { replace, to } = this.props;
        const { router: { history }, preloader: { preload } } = this.context;
        const location =
          typeof to === 'string'
            ? createLocation(to, null, null, history.location)
            : to;
        const href = history.createHref(location);
        const preloader = createPreloader(href, this.props);

        await preload(preloader);

        if (replace) {
          history.replace(to);
        } else {
          history.push(to);
        }
      }
    };
  };
}
