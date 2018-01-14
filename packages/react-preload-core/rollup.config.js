import build from '../../rollup.config';

export default build('ReactPreloadCore', 'react-preload-core', {
  react: 'React',
  'react-dom': 'ReactDOM',
  'prop-types': 'PropTypes',
});
