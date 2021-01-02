import typescript from 'rollup-plugin-typescript2';

const srcFilePath = './lib/index.ts';
const distFilePathPrefix = '../dist/lib/index.';

const rollupParms = { tsconfig: 'ts-lib-config.json' };

export default [
  {
    input: srcFilePath,
    output: {
      file: distFilePathPrefix + 'esm.js',
      format: 'esm',
    },
    plugins: [typescript(rollupParms)],
  },
  {
    input: srcFilePath,
    output: {
      file: distFilePathPrefix + 'js',
      format: 'cjs',
    },
    plugins: [typescript(rollupParms)],
  },
]