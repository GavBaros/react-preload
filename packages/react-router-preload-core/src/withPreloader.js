// @flow

import React, { Component } from 'react';
import { PreloaderPropType } from './index';

const noop = () => {};

export function withPreloader(BaseComponent) {
  return class WithPreloader extends Component {
    displayName = `${BaseComponent.displayName}WithPreloader`;

    static contextTypes = {
      preloader: PreloaderPropType,
    };

    render() {
      const { preloader } = this.context;

      return (
        <BaseComponent
          preload={(preloader && preloader.preload) || noop}
          {...this.props}
        />
      );
    }
  };
}
