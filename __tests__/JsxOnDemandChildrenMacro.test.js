'use strict';

const plugin = require('babel-plugin-macros');
const pluginTester = require('babel-plugin-tester').default

pluginTester({
  plugin,
  snapshot: true,
  title: 'JsxOnDemandChildrenMacro',
  babelOptions: { filename: __filename, parserOpts: { plugins: ['jsx'] } },
  tests: {
    works: {
      code: `
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
    'Invalid usage: no parent': {
      code:`
        'use strict';

        import React from 'react';
        import JsxOnDemandChildren from '../src/macro';

        JsxOnDemandChildren;

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
      error: SyntaxError,
    },
    'Invalid usage: not JSXElement': {
      code: `
        'use strict';

        import React from 'react';
        import JsxOnDemandChildren from '../src/macro';

        JsxOnDemandChildren.invalid = true;

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
      error: SyntaxError,
    },
  },
});