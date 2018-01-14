import build from '../../rollup.config';

export default build(
  'ReactPreloadUniversalComponent',
  'react-preload-universal-component',
  {
    'react-preload-core': 'ReactPreloadCore',
  },
);
