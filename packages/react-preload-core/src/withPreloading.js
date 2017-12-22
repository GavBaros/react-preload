// @flow

import React from 'react';

export function withPreloading(
  preloadCallback: (
    element: React$Element<any>,
    instance: ?React$Component<any, any>,
    context: Object,
    options: any,
  ) => Promise<any>,
) {
  return function(
    BaseComponent: React$ComponentType<any>,
  ): React$ComponentType<any> {
    const preloadComponent = (
      element: React$Element<any>,
      instance: ?React$Component<any, any>,
      context: Object,
      options: any,
    ) => {
      return preloadCallback(element, instance, context, options);
    };

    if (
      BaseComponent.prototype &&
      (BaseComponent.prototype.isReactComponent ||
        BaseComponent.prototype.isPureReactComponent)
    ) {
      return class ComponentWithPreload extends BaseComponent {
        preloadComponent = preloadComponent;
      };
    }

    return class ComponentWithPreload extends React.Component<any> {
      preloadComponent = preloadComponent;

      render() {
        return <BaseComponent {...this.props} />;
      }
    };
  };
}
