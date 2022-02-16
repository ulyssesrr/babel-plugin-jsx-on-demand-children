const esbuild = require('esbuild');

esbuild
  .build({
    entryPoints: ['src/index.js', 'src/macro.js'],
    outdir: 'dist',
    bundle: false,
    sourcemap: false,
    minify: false,
    platform: 'node',
    target: ['node10.4'],
  })
  .then(() => console.log('Done!'))
  .catch(() => process.exit(1));