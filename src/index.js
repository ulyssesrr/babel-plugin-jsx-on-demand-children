const Babel = require('@babel/core');

const MAIN_ELEMENT_NAME = 'JsxOnDemandChildren';

function ifStatement(babel) {
  var types = babel.types;

  return function (node, file) {
    var ifBlock;
    var elseBlock;
    var errorInfos = { node: node, file: file, element: ELEMENTS.IF };
    var condition = conditionalUtil.getConditionExpression(node, errorInfos);
    var key = astUtil.getKey(node);
    var children = astUtil.getChildren(types, node);
    var blocks = getBlocks(children);

    ifBlock = astUtil.getSanitizedExpressionForContent(types, blocks.ifBlock, key);

    return types.ConditionalExpression(condition, ifBlock, elseBlock);
  };
};

function addNodeAttribute(babel, openingElement, attributeName, attributeValue) {
  const { types: t } = babel;

  const existingProp = openingElement.attributes.find(
    node => node.name && node.name.name === attributeName
  )

  if (existingProp) {
    existingProp.node.value.value = attributeValue;
  } else {
    const newProp = t.jSXAttribute(
      t.jSXIdentifier(attributeName),
      attributeValue
    );

    openingElement.attributes.push(newProp);
  }
}

/**
 * @param {Babel} babel
 */
function createJsxOnDemandContainerHandler(babel) {
  const { types: t } = babel;

  return function(path) {
    const parentPath = path.parentPath;

    const { openingElement } = parentPath.node;

    const { children } = path.node;

    for (const child of children) {
      if (child.type === 'JSXElement') {
        const childOpeningElement = child.openingElement;
        const nodeName = childOpeningElement.name.name;
        const renderFuncExpression = t.arrowFunctionExpression([], child);
        
        addNodeAttribute(babel, openingElement, nodeName, t.jsxExpressionContainer(renderFuncExpression));
      //} if (child.type === 'JSXText' && ) {

      } else {
        console.log("Invalid child: ", child)
        throw path.hub.buildError(child, `Invalid child (${child.type}) inside <${MAIN_ELEMENT_NAME}>`);
      }
    }

    path.remove();
  }
}

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
        //path.replaceWith(handler(path.node, path.hub.file));
      }
    }
  };

  return {
    visitor
  };
};

module.exports = jodcPlugin;