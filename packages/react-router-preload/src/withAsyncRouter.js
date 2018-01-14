// @flow

import React from 'react';
import PropTypes from 'prop-types';

export function withAsyncRouter(BaseComponent: React$ComponentType<any>) {
  return class WithLoadingState extends React.Component<any> {
    static contextTypes = {
      router: PropTypes.shape({
        transitioning: PropTypes.bool.isRequired,
        preload: PropTypes.func.isRequired,
      }),
    };

    render() {
      const { transitioning = false, preload = () => null } =
        this.context.router || {};

      return (
        <BaseComponent
          {...this.props}
          transitioning={transitioning}
          preload={preload}
        />
      );
    }
  };
}
