const esbuild = require('esbuild');

esbuild
  .build({
    entryPoints: ['src/index.js', 'src/macro.js'],
    outdir: 'lib',
    bundle: true,
    sourcemap: true,
    minify: true,
    platform: 'node',
    target: ['node10.4'],
  })
  .then(() => console.log('Done!'))
  .catch(() => process.exit(1));