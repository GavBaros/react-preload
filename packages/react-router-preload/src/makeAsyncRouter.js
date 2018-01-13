// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { preloadRoute } from './preloadRoute';

type AsyncRouterState = {
  match: Object,
  location: Object,
};

type AsyncRouterProps = {
  children: React$Element<any>,
};

export const makeAsyncRouter = (
  BaseComponent: React$ComponentType<AsyncRouterProps>,
) => {
  class AsyncRouter extends React.Component<
    AsyncRouterProps,
    AsyncRouterState,
  > {
    static contextTypes = {
      router: PropTypes.shape({
        history: PropTypes.object.isRequired,
        route: PropTypes.object.isRequired,
        staticContext: PropTypes.object,
      }),
    };

    static childContextTypes = {
      router: PropTypes.object.isRequired,
    };

    state = {
      match: this.context.router.route.match,
      location: this.context.router.history.location,
      next: undefined,
    };

    getChildContext() {
      return {
        router: {
          ...this.context.router,
          route: {
            ...this.context.router.route,
            location: this.state.location,
            match: this.state.match,
          },
        },
      };
    }

    componentWillReceiveProps(nextProps, nextContext) {
      const nextLocation = nextContext.router.route.location;
      const nextMatch = nextContext.router.route.match;
      const currentLocation = this.state.location;

      // Check if we are already on the target route.
      if (nextLocation === currentLocation) {
        return;
      }

      // Check if we are already loading the target route.
      if (nextLocation !== this.state.next) {
        return;
      }

      // Store the target location to prevent subsequent / queued up route
      // changes from causing hick-ups when triggering location changes
      // quickly.
      this.setState({ next: nextLocation });

      // Load the target route in the background. Delay the transition
      // until the promise has been resolved.
      preloadRoute(nextLocation, nextProps.children).then(() => {
        this.setState(prevState => {
          if (nextLocation !== prevState.next) {
            return null;
          }

          return {
            location: nextLocation,
            match: nextMatch,
            next: undefined,
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
};
