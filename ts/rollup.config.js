import typescript from 'rollup-plugin-typescript2';

const srcFilePath = '../lib/index.ts';
const destFilePathPrefix = '../lib/index.';

const rollupParms = { tsconfig: 'ts-lib-config.json' };

export default [
  {
    input: srcFilePath,
    output: {
      file: destFilePathPrefix + 'esm.js',
      format: 'esm',
    },
    plugins: [typescript(rollupParms)],
  },
  {
    input: srcFilePath,
    output: {
      file: destFilePathPrefix + 'js',
      format: 'cjs',
    },
    plugins: [typescript(rollupParms)],
  },
]