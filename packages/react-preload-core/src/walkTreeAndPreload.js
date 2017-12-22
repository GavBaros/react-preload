// @flow

import reactTreeWalker from 'react-tree-walker';

export function walkTreeAndPreload(
  rootElement: React$Element<any>,
  rootContext: Object = {},
  options: any,
): Promise<void> {
  function nodeVisitor(
    element: React$Element<any>,
    instance: React$Component<any>,
    context: Object = {},
  ) {
    if (instance && typeof instance.preloadComponent === 'function') {
      return instance.preloadComponent(element, instance, context, options);
    }

    return true;
  }

  return reactTreeWalker(rootElement, nodeVisitor, rootContext);
}
