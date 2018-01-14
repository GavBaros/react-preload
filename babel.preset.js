const BABEL_ENV = process.env.BABEL_ENV;
const NODE_ENV = process.env.NODE_ENV;
const building = BABEL_ENV !== undefined && BABEL_ENV !== 'cjs';

const plugins = ['transform-flow-strip-types'];

if (BABEL_ENV === 'umd') {
  plugins.push('external-helpers');
}

module.exports = {
  presets: [
    [
      'env',
      {
        targets: {
          browsers: ['last 2 versions'],
        },
        loose: true,
        modules: building ? false : 'commonjs',
      },
    ],
    'stage-1',
    'react',
  ],
  plugins: plugins,
};
