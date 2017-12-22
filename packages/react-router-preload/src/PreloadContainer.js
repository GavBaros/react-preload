// @flow

import React from 'react';
import PropTypes from 'prop-types';

export class PreloadContainer extends React.Component<any> {
  static childContextTypes = {
    preloader: PropTypes.shape({
      children: PropTypes.any.isRequired,
    }).isRequired,
  };

  getChildContext() {
    return {
      preloader: {
        children: this.props.children,
      },
    };
  }

  render() {
    return this.props.children;
  }
}
