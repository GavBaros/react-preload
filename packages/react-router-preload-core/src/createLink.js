// @flow

import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function createLink(preloadCb: Function) {
  function createPreloader(linkProps: Object) {
    return async function doPreload(
      targetHref: string,
      containerProps: Object,
    ) {
      const routerContext = {};
      const rootElement = (
        <StaticRouter location={targetHref} context={routerContext}>
          {containerProps.children}
        </StaticRouter>
      );

      // Mock the preloader context.
      const rootContext = {
        preloader: {
          preload: () => Promise.resolve(),
          loading: true,
        },
      };

      await preloadCb(
        rootElement,
        rootContext,
        linkProps,
        containerProps,
        targetHref,
      );

      // If the app was redirected during preloading, we need to
      // also preload the next route.
      if (routerContext.url) {
        await doPreload(routerContext.url, containerProps);
      }
    };
  }

  return class AsyncLink extends Link {
    static contextTypes = {
      preloader: PropTypes.shape({
        preload: PropTypes.func.isRequired,
        loading: PropTypes.bool.isRequired,
      }),
      router: PropTypes.shape({
        history: PropTypes.shape({
          push: PropTypes.func.isRequired,
          replace: PropTypes.func.isRequired,
          createHref: PropTypes.func.isRequired,
        }).isRequired,
        route: PropTypes.object,
      }).isRequired,
    };

    handleClickOriginal = this.handleClick;

    handleClick = event => {
      event.preventDefault();
      event.persist();

      // eslint-disable-next-line no-param-reassign
      event.defaultPrevented = false;

      const { to } = this.props;
      const { router, preloader } = this.context;

      const args = typeof to === 'string' ? { pathname: to } : to;
      const href = router.history.createHref(args);
      const preload = createPreloader(this.props);

      preloader
        .preload(href, preload)
        .then(
          () => this.handleClickOriginal(event),
          () => this.handleClickOriginal(event),
        );
    };
  };
}
