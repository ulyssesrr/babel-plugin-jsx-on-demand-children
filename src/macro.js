'use strict';

const { createMacro } = require('babel-plugin-macros');
const createJsxOnDemandContainerHandler = require('./createJsxOnDemandContainerHandler');

function JsxOnDemandChildrenMacro({ references, babel }) {
  const nodeHandler = createJsxOnDemandContainerHandler(babel);
  for (const referenceKey in references) {
    const referencesByKey = references[referenceKey];
    for (const path of referencesByKey) {
      const { parentPath } = path;
      if (parentPath?.node?.type === 'JSXOpeningElement') {
        const jsxElementPath = parentPath.parentPath;
        nodeHandler(jsxElementPath);
      }
    }
    
  }
}

module.exports = createMacro(JsxOnDemandChildrenMacro);