// @flow

import React, { Component } from 'react';
import { PreloaderPropType } from './index';

export default function withLoadingState(BaseComponent) {
  const displayName = BaseComponent.displayName;

  return class WithLoadingState extends Component {
    static displayName = `${BaseComponent.displayName}WithLoadingState`;

    static contextTypes = {
      preloader: PreloaderPropType.isRequired,
    };

    render() {
      return (
        <BaseComponent
          loading={this.context.preloader.loading}
          {...this.props}
        />
      );
    }
  };
}
