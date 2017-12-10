import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import build, { globals } from '../../rollup.config';
import pkg from './package.json';

export default build('reactPreload.core', pkg).concat({
  input: 'src/server.js',
  output: [{ file: 'lib/server.js', format: 'cjs' }],
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
});
