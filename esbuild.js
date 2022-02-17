const fs = require('fs');
const esbuild = require('esbuild');

const sourceFiles = fs.readdirSync('./src/')
  .filter((fileName) => (fileName.endsWith('.js')))
  .map((fileName) => (`src/${fileName}`));

console.log("Building...");
console.log(sourceFiles);
esbuild
  .build({
    entryPoints: sourceFiles,
    outdir: 'dist',
    bundle: false,
    sourcemap: false,
    minify: false,
    platform: 'node',
    target: ['node10.4'],
  })
  .then(() => console.log('Done!'))
  .catch(() => process.exit(1));