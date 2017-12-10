// @flow

import React, { Component } from 'react';
import { PreloaderPropType } from './index';

export default function withPreloader(BaseComponent) {
  const displayName = BaseComponent.displayName;

  return class WithPreloader extends Component {
    static displayName = `${BaseComponent.displayName}WithPreloader`;

    static contextTypes = {
      preloader: PreloaderPropType.isRequired,
    };

    render() {
      return (
        <BaseComponent
          preload={this.context.preloader.preload}
          {...this.props}
        />
      );
    }
  };
}
