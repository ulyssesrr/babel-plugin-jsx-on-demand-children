'use strict';

const plugin = require('babel-plugin-macros');
const pluginTester = require('babel-plugin-tester').default

pluginTester({
  plugin,
  snapshot: true,
  title: 'JsxOnDemandChildrenMacro',
  babelOptions: { filename: __filename, parserOpts: { plugins: ['jsx'] } },
  tests: {
    works: `
      'use strict';

      import React from 'react';
      import JsxOnDemandChildren from '../src/macro';

      function Test() {
        return (
          <Parent>
            <JsxOnDemandChildren>
              <Parent.LeafChild prop={true} />
            </JsxOnDemandChildren>
          </Parent>
        );
      };
    `,
  },
});