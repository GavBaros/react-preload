import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export const globals = {
  'react-router-preload': 'reactRouterPreload.core',
  'react-router-preload-tree': 'reactRouterPreload.tree',
  'react-router-preload-apollo': 'reactRouterPreload.treeApollo',
  'react-router-preload-component': 'reactRouterPreload.treeUniversalComponent',
};

export default (name, pkg) => [
  {
    name: `reactRouterPreload.${name}`,
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
