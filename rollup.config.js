import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export const globals = {
  'react-preload-apollo': 'reactPreload.apollo',
  'react-preload-core': 'reactPreload.core',
  'react-preload-universal-component': 'reactPreload.universalComponent',
  'react-router-preload-core': 'reactRouterPreload.core',
  'react-router-preload-tree': 'reactRouterPreload.tree',
};

export default (name, pkg) => [
  {
    name: name,
    input: 'src/index.js',
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
    ],
    exports: 'named',
    external: Object.keys(globals),
    globals: globals,
    plugins: [
      babel({
        exclude: ['node_modules/**'],
      }),
      resolve(),
      commonjs(),
    ],
  },
];
