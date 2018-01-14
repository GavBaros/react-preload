import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';

const env = process.env.NODE_ENV || 'development';

export default (name, file, globals = {}) => {
  const config = {
    name: name,
    input: 'src/index.js',
    output: [{ file: `${file}.min.js`, format: 'umd' }],
    globals: globals,
    exports: 'named',
    external: Object.keys(globals),
    plugins: [
      babel({
        exclude: ['node_modules/**'],
      }),
      resolve(),
      replace({
        'process.env.NODE_ENV': JSON.stringify(env),
      }),
      commonjs({
        include: /node_modules/,
      }),
    ],
  };

  if (env === 'production') {
    config.plugins.push(uglify());
  }

  return config;
};
