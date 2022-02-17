'use strict';
//const Babel = require('@babel/core');

function addNodeAttribute(babel, openingElement, attributeName, attributeValue) {
  const { types: t } = babel;

  const existingProp = openingElement.attributes.find(
    node => node.name && node.name.name === attributeName
  )

  if (existingProp) {
    existingProp.value = attributeValue;
  } else {
    const newProp = t.jSXAttribute(
      t.jSXIdentifier(attributeName),
      attributeValue
    );

    openingElement.attributes.push(newProp);
  }
  return existingProp;
}

/**
 * @param {Babel} babel
 */
function createJsxOnDemandContainerHandler(babel) {
  const { types: t } = babel;

  const IGNORED_AST_TYPES = ['JSXText']

  return function (path) {
    const onDemandNodeName = path.node.openingElement.name.name;
    const parentPath = path.parentPath;

    const { openingElement } = parentPath.node;
    const nodeName = openingElement.name.name;

    const { children } = path.node;

    if (children.length === 0) {
      throw path.hub.buildError(path.node, `No child nodes inside <${onDemandNodeName}>.`);
    }

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
          const existingProp = addNodeAttribute(babel, openingElement, attributeName, t.jsxExpressionContainer(renderFuncExpression));
          if (existingProp) {
            throw path.hub.buildError(child, `On demand node <${nodeName}.${childNameNode.property.name}> would override prop '${attributeName}' in <${nodeName}>.`);
          }
        } else {
          throw path.hub.buildError(child, `Unexpected child node type: ${childNameNode.type} inside <${onDemandNodeName}>.`);
        }
      } else if (child.type === 'JSXText') {
        if (child.value.replace(/[\s\r\n\t]/g, "").length !== 0) {
          throw path.hub.buildError(child, `Text is not allowed inside <${onDemandNodeName}>.`);
        }
      } else {
        throw path.hub.buildError(child, `Invalid child (${child.type}) inside <${onDemandNodeName}>.`);
      }
    }

    path.remove();
  }
}

module.exports = createJsxOnDemandContainerHandler;