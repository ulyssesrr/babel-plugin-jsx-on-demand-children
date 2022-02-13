'use strict';

test.skip('util', () => { });

const JsxOnDemandChildrenPlugin = require("../src/index");
const babel = require('@babel/core');
const prettier = require('prettier');

function transformerWithOptions(
  options,
  environment,
  filename,
) {
  return (text, providedFileName) => {
    const previousEnv = process.env.BABEL_ENV;
    try {
      process.env.BABEL_ENV = environment;
      const code = babel.transform(text, {
        compact: false,
        cwd: '/',
        filename: filename || providedFileName || 'test.js',
        highlightCode: false,
        parserOpts: { plugins: ['jsx'] },
        plugins: [[JsxOnDemandChildrenPlugin, options]],
      }).code;
      return prettier.format(code, {
        bracketSameLine: true,
        bracketSpacing: false,
        parser: 'flow',
        requirePragma: false,
        singleQuote: true,
        trailingComma: 'all',
      });
    } finally {
      process.env.BABEL_ENV = previousEnv;
    }
  };
}

module.exports = transformerWithOptions;