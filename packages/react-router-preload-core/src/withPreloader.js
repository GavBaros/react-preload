// @flow

import React, { Component } from 'react';
import { PreloaderPropType } from './index';

const noop = () => {};

export default function withPreloader(BaseComponent) {
  return class WithPreloader extends Component {
    displayName = `${BaseComponent.displayName}WithPreloader`;

    static contextTypes = {
      preloader: PreloaderPropType,
    };

    render() {
      return (
        <BaseComponent
          preload={
            (this.context.preloader && this.context.preloader.preload) || noop
          }
          {...this.props}
        />
      );
    }
  };
}
