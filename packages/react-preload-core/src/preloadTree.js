// @flow

import reactTreeWalker from 'react-tree-walker';

export type PreloadVisitorFn = (
  element: React$Element<any>,
  instance: React$Component<any, any>,
  context: Object,
) => ?Promise<any>;

export function preloadTree(
  rootElement: React$Element<any>,
  rootContext: Object = {},
  visitRoot: boolean = true,
  preloadFns: Array<PreloadVisitorFn> = [],
): Promise<void> {
  function nodeVisitor(element, instance, context) {
    if (visitRoot && element !== rootElement) {
      for (let currentFn of preloadFns) {
        const currentResult = currentFn(element, instance, context);

        if (typeof currentResult !== 'undefined') {
          return Promise.race([currentResult])
            .then(() => preloadTree(element, context, true, preloadFns))
            .then(() => false)
            .catch(() => false);
        }
      }
    }

    return true;
  }

  return reactTreeWalker(rootElement, nodeVisitor, rootContext);
}
