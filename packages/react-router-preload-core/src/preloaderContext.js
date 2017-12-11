// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';

export const PreloaderPropType = PropTypes.shape({
  preload: PropTypes.func.isRequired,
});

export class Preloader extends Component {
  static childContextTypes = {
    preloader: PreloaderPropType,
  };

  getChildContext() {
    return {
      preloader: {
        preload: this.preload,
      },
    };
  }

  preload = async (preloadCb: (props: Object) => Promise<any>) => {
    await preloadCb(this.props);
  };

  render() {
    return React.Children.only(this.props.children);
  }
}
