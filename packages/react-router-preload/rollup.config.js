import build from '../../rollup.config';

export default build('ReactRouterPreload', 'react-router-preload', {
  react: 'React',
  'react-dom': 'ReactDOM',
  'prop-types': 'PropTypes',
  'react-router-dom': 'ReactRouterDOM',
  history: 'History',
  'react-preload-core': 'ReactPreloadCore',
});
