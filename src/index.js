const createJsxOnDemandContainerHandler = require('./createJsxOnDemandContainerHandler');

const MAIN_ELEMENT_NAME = 'JsxOnDemandChildren';

/**
 * @param {Babel} babel
 */
function jodcPlugin(babel) {
  const nodeHandler = createJsxOnDemandContainerHandler(babel);

  const visitor = {
    JSXElement: function (path) {
      const nodeName = path.node.openingElement.name.name;

      if (nodeName === MAIN_ELEMENT_NAME) {
        nodeHandler(path);
      }
    }
  };

  return {
    visitor
  };
};

module.exports = jodcPlugin;