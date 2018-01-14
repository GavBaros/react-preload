// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { createLocation } from 'history';
import { preloadRoute } from './preloadRoute';

type AsyncRouterState = {
  match: Object,
  location: Object,
  transitioning: boolean,
  next?: Object,
};

type AsyncRouterProps = {
  children: React$Element<any>,
};

export function makeAsyncRouter(
  BaseComponent: React$ComponentType<AsyncRouterProps>,
) {
  class AsyncRouter extends React.Component<
    AsyncRouterProps,
    AsyncRouterState,
  > {
    static contextTypes = {
      router: PropTypes.object.isRequired,
    };

    static childContextTypes = {
      router: PropTypes.object.isRequired,
    };

    state = {
      match: this.context.router.route.match,
      location: this.context.router.history.location,
      transitioning: false,
      next: undefined,
    };

    loading = {};

    preload = (location: Object | string) => {
      const { history } = this.context.router;

      const target =
        typeof location === 'string'
          ? createLocation(location, null, null, history.location)
          : location;

      const href = history.createHref(target);
      if (this.loading.hasOwnProperty(href)) {
        return this.loading[href];
      }

      return (this.loading[href] = preloadRoute(
        target,
        this.props.children,
      ).then(() => {
        delete this.loading[href];
      }));
    };

    getChildContext() {
      return {
        router: {
          ...this.context.router,
          transitioning: this.state.transitioning,
          preload: this.preload,
          route: {
            ...this.context.router.route,
            location: this.state.location,
            match: this.state.match,
          },
        },
      };
    }

    componentWillReceiveProps(nextProps, nextContext) {
      const { createHref } = this.context.router.history;
      const nextLocation = nextContext.router.route.location;
      const nextHref = createHref(nextLocation);
      const nextMatch = nextContext.router.route.match;
      const currentLocation = this.state.location;
      const currentHref = createHref(currentLocation);

      // Check if we are already on the target route.
      if (nextHref === currentHref) {
        return;
      }

      // Check if we are already transitioning to the target route.
      if (this.state.next && nextHref === createHref(this.state.next)) {
        return;
      }

      // Store the target location to prevent subsequent / queued up route
      // changes from causing hick-ups when triggering location changes
      // quickly.
      this.setState({ next: nextLocation, transitioning: true });

      // Load the target route in the background. Delay the transition
      // until the promise has been resolved.
      this.preload(nextLocation).then(() => {
        this.setState(prevState => {
          if (nextHref !== createHref(prevState.next)) {
            return null;
          }

          return {
            location: nextLocation,
            match: nextMatch,
            next: undefined,
            transitioning: false,
          };
        });
      });
    }

    render() {
      return React.Children.only(this.props.children);
    }
  }

  return ({ children, ...props }: AsyncRouterProps) => (
    <BaseComponent {...props}>
      <AsyncRouter>{children}</AsyncRouter>
    </BaseComponent>
  );
}
