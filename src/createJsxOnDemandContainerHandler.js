'use strict';
const Babel = require('@babel/core');

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

  const IGNORED_AST_TYPES = ['JSXText']

  return function (path) {
    const parentPath = path.parentPath;

    const { openingElement } = parentPath.node;
    const nodeName = openingElement.name.name;

    const { children } = path.node;

    for (const child of children) {
      if (child.type === 'JSXElement') {
        const childOpeningElement = child.openingElement;
        const childNameNode = childOpeningElement.name;

        if (childNameNode.type === 'JSXIdentifier') {
          const childNodeName = childNameNode.name;
          throw path.hub.buildError(child, `On demand nodes inside <${nodeName}> must be a member of it, got <${childNodeName}>, did you mean <${nodeName}.${childNodeName}> ?`);
        } else if (childNameNode.type === 'JSXMemberExpression') {
          if (childNameNode.object.name !== nodeName) {
            const childNodeName = `${childNameNode.object.name}.${childNameNode.property.name}`;
            throw path.hub.buildError(child, `On demand nodes inside <${nodeName}> must be a member of it, got <${childNodeName}>, did you mean <${nodeName}.${childNameNode.property.name}> ?`);
          }
          
          const renderFuncExpression = t.arrowFunctionExpression([], child);

          const attributeName = childNameNode.property.name;
          addNodeAttribute(babel, openingElement, attributeName, t.jsxExpressionContainer(renderFuncExpression));
        } else {
          throw path.hub.buildError(child, `Unexpected child node type: ${childNameNode.type}`);
        }
      } else if (!IGNORED_AST_TYPES.includes(child.type)) {
        console.log("Invalid child: ", child)
        throw path.hub.buildError(child, `Invalid child (${child.type}) inside <${nodeName}>`);
      }
    }

    path.remove();
  }
}

module.exports = createJsxOnDemandContainerHandler;