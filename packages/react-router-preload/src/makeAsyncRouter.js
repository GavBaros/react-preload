// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { preloadRoute } from './preloadRoute';

export const makeAsyncRouter = BaseComponent => {
  class AsyncRouter extends React.Component<any> {
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
    };

    preload = location => {
      const href = this.context.router.history.createHref(location);
      return preloadRoute(href, this.props.children);
    };

    getChildContext() {
      return {
        router: {
          ...this.context.router,
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
      const nextLocation = nextContext.router.route.location;
      const nextMatch = nextContext.router.route.match;
      const currentLocation = this.state.location;

      if (nextLocation !== currentLocation) {
        this.preload(nextLocation).then(() => {
          this.setState({
            location: nextLocation,
            match: nextMatch,
          });
        });
      }
    }

    render() {
      return React.Children.only(this.props.children);
    }
  }

  return ({ children, ...props }) => (
    <BaseComponent {...props}>
      <AsyncRouter>{children}</AsyncRouter>
    </BaseComponent>
  );
};
