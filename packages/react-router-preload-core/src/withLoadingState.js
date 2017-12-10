// @flow

import React, { Component } from 'react';
import { PreloaderPropType } from './index';

export default function withLoadingState(BaseComponent) {
  return class WithLoadingState extends Component {
    displayName = `${BaseComponent.displayName}WithLoadingState`;

    static contextTypes = {
      preloader: PreloaderPropType,
    };

    render() {
      return (
        <BaseComponent
          loading={!!(this.context.preloader && this.context.preloader.loading)}
          {...this.props}
        />
      );
    }
  };
}
