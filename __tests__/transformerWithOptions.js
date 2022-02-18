'use strict';

test.skip('util', () => { });

import { transform } from '@babel/core';
import { format } from 'prettier';

export function transformerWithOptions(
  plugins,
  environment,
  filename,
) {
  return (text, providedFileName) => {
    const previousEnv = process.env.BABEL_ENV;
    try {
      process.env.BABEL_ENV = environment;
      const code = transform(text, {
        compact: false,
        cwd: __dirname,
        filename: filename || providedFileName || 'test.js',
        highlightCode: false,
        parserOpts: { plugins: ['jsx'] },
        plugins: plugins,
      }).code;
      return format(code, {
        bracketSameLine: true,
        bracketSpacing: false,
        parser: 'flow',
        requirePragma: false,
        singleQuote: true,
        trailingComma: 'all',
      });
    } catch (e) {
      e.message = e.message.replace(__dirname, '');
      throw e;
    } finally {
      process.env.BABEL_ENV = previousEnv;
    }
  };
}

/**
 * Extend Jest with a custom snapshot serializer to provide additional context
 * and reduce the amount of escaping that occurs.
 */
export const FIXTURE_TAG = Symbol.for('FIXTURE_TAG');

export const snapshotSerializer = {
  print(value) {
    return Object.keys(value)
      .map(key => `~~~~~~~~~~ ${key.toUpperCase()} ~~~~~~~~~~\n${value[key]}`)
      .join('\n');
  },
  test(value) {
    return value && value[FIXTURE_TAG] === true;
  },
}