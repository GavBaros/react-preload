// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';

export const PreloaderPropType = PropTypes.shape({
  preload: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
});

export default class Preloader extends Component {
  static childContextTypes = {
    preloader: PreloaderPropType.isRequired,
  };

  state = {
    loading: false,
  };

  getChildContext() {
    return {
      preloader: {
        preload: this.preload,
        loading: this.state.loading,
      },
    };
  }

  preload = async (targetHref: string, preloadCb: () => Promise<any>) => {
    this.setState({ loading: true });
    await preloadCb(targetHref, this.props);
    this.setState({ loading: false });
  };

  render() {
    return React.Children.only(this.props.children);
  }
}
