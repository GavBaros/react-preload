// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { createLocation } from 'history';
import { preloadRoute } from './utils/preloadRoute';

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

export function withRoutePreloading(options: ?Object) {
  return (BaseComponent: React$ComponentType<any>) => {
    return class LinkWithPreload extends React.Component<any> {
      displayName = `${BaseComponent.displayName}WithPreload`;

      static contextTypes = {
        preloader: PropTypes.shape({
          children: PropTypes.any.isRequired,
        }).isRequired,
        router: PropTypes.shape({
          history: PropTypes.shape({
            push: PropTypes.func.isRequired,
            replace: PropTypes.func.isRequired,
            createHref: PropTypes.func.isRequired,
          }).isRequired,
        }).isRequired,
      };

      // This is copied from the react-router-dom project.
      handleClick = async event => {
        if (this.props.onClick) {
          this.props.onClick(event);
        }

        if (
          !event.defaultPrevented && // onClick prevented default
          event.button === 0 && // ignore everything but left clicks
          !this.props.target && // let browser handle "target=_blank" etc.
          !isModifiedEvent(event) // ignore clicks with modifier keys
        ) {
          event.preventDefault();

          const { router: { history }, preloader: { children } } = this.context;
          const { replace, to } = this.props;

          const location =
            typeof to === 'string'
              ? createLocation(to, null, null, history.location)
              : to;
          const href = history.createHref(location);

          // Render the next route and wait for it to have its
          // dependencies loaded before transitioning.
          await preloadRoute(href, children);

          if (replace) {
            history.replace(to);
          } else {
            history.push(to);
          }
        }
      };

      render() {
        return <BaseComponent {...this.props} onClick={this.handleClick} />;
      }
    };
  };
}
