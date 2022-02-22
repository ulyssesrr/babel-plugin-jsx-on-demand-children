<div>
<h1>babel-plugin-jsx-on-demand-children</h1>

<p>Babel plugin/macro offering a pleasant syntax for rendering children on demand.</p>
</div>

---

<!-- prettier-ignore-start -->
[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]
[![version][version-badge]][package]
[![MIT License][license-badge]][license]

[![Babel Macro][babel-plugin-macros-badge]][babel-plugin-macros]
[![PRs Welcome][prs-badge]][prs]
[![Code of Conduct][coc-badge]][coc]
<!-- prettier-ignore-end -->

## Introduction

A React component added to the tree will always evaluate all of its properties including the component body. 
A simple example of this (taken from [jsx-control-statements]) is attempting to implement a conditional component:

```javascript
<IfComponent condition={item}>
  <Text>{item.title}</Text>
</IfComponent>
```

The error will be "Cannot read property 'title' of undefined", because React will evaluate the body of the custom
component and pass it as "children" property to it. The only workaround is to force React into lazy evaluation by
wrapping the statement in a function.

```javascript
<IfComponent condition={item} render={() => (<Text>{item.title}</Text>)}></IfComponent>
```

This is precisely what this plugin/macro does, albeit with a slightly different syntax:
```javascript
<AsyncHandler status={status}>
  <JsxOnDemandChildren>
    <AsyncHandler.Loading>...</AsyncHandler.Loading>
    <AsyncHandler.Success>...</AsyncHandler.Success>
    <AsyncHandler.Error>...</AsyncHandler.Error>
  </JsxOnDemandChildren>
</AsyncHandler>
```
becomes:
```javascript
<AsyncHandler 
  Loading={() => <AsyncHandler.Loading>...</AsyncHandler.Loading>} 
  Success={() => <AsyncHandler.Success>...</AsyncHandler.Success>}
  Error={() => <AsyncHandler.Error>...</AsyncHandler.Error>}>
</AsyncHandler>
```
This is most useful for components written to take advantage of this plugin, in the example above the `AsyncHandler` component could look like this:

```javascript
export default function AsyncHandler({ status, Loading, Success, Error }) {
  switch (status) {
    case 'success':
      return <Success />;
    case 'error':
      return Error ? <Error /> : null;
    case 'loading':
    default:
      return <Loading />;
  }
}

AsyncHandler.Loading = ({ children }) => <>{children}</>;

AsyncHandler.Success = ({ children }) => <>{children}</>;

AsyncHandler.Error = ({ children }) => <>{children}</>;
```
## Installation

### Option 1: As a macro (Recommended)

Install `babel-plugin-macros` and `babel-plugin-jsx-on-demand-children` to your `devDependencies`:

```
npm install --save-dev babel-plugin-macros babel-plugin-jsx-on-demand-children
```

Add `babel-plugin-macros` to your babel configuration:

[Adding babel-plugin-macros to your config][babel-plugin-macros.config]

## Usage

If installed as a macro, import it
```javascript
import JsxOnDemandChildren from 'babel-plugin-jsx-on-demand-children/macro'

// or
const JsxOnDemandChildren = require('babel-plugin-jsx-on-demand-children/macro')
```

Create your custom component, ie:
```javascript


export default function Conditional({ condition, If, Else}) {
  return condition ? (<If />) : (<Else />);
}

Conditional.If = function({children}) {
  return <>{children}</>;
}

Conditional.Else = function({children}) {
  return <>{children}</>;
}
```

Use with `<JsxOnDemandChildren>`:
```javascript
import Conditional from './Conditional';

function SomeComponent() {
  return (
    <Conditional condition={isOk}>
      <JsxOnDemandChildren>
        <Conditional.If>
          Everything is fine!
        </Conditional.If>
        <Conditional.Else>
          We have a problem!
        </Conditional.Else>
      </JsxOnDemandChildren>
    </Conditional>
  );
}
```

## Sandbox Demos
- [AsyncHandler Component][demo-asynchandler]


## LICENSE

MIT

<!-- prettier-ignore-start -->
[npm]: https://www.npmjs.com
[node]: https://nodejs.org
[build-badge]: https://img.shields.io/github/workflow/status/ulyssesrr/babel-plugin-jsx-on-demand-children/Node.js%20CI
[build]: https://github.com/ulyssesrr/babel-plugin-jsx-on-demand-children/actions
[coverage-badge]: https://img.shields.io/codecov/c/github/ulyssesrr/babel-plugin-jsx-on-demand-children/main
[coverage]: https://app.codecov.io/gh/ulyssesrr/babel-plugin-jsx-on-demand-children
[babel-plugin-macros-badge]: https://img.shields.io/badge/babel--macro-%F0%9F%8E%A3-f5da55.svg?style=flat-square
[babel-plugin-macros]: https://github.com/kentcdodds/babel-plugin-macros
[version-badge]: https://img.shields.io/npm/v/babel-plugin-jsx-on-demand-children.svg?style=flat-square
[package]: https://www.npmjs.com/package/babel-plugin-jsx-on-demand-children
[downloads-badge]: https://img.shields.io/npm/dm/babel-plugin-jsx-on-demand-children.svg?style=flat-square
[npmtrends]: https://www.npmtrends.com/babel-plugin-jsx-on-demand-children
[license-badge]: https://img.shields.io/npm/l/babel-plugin-jsx-on-demand-children
[license]: https://github.com/ulyssesrr/babel-plugin-jsx-on-demand-children/blob/main/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/ulyssesrr/babel-plugin-jsx-on-demand-children/blob/main/other/CODE_OF_CONDUCT.md
[emojis]: https://github.com/all-contributors/all-contributors#emoji-key
[all-contributors]: https://github.com/all-contributors/all-contributors

[jsx-control-statements]: https://github.com/AlexGilleran/jsx-control-statements
[babel-plugin-macros]: https://github.com/kentcdodds/babel-plugin-macros
[babel-plugin-macros.config]: https://github.com/kentcdodds/babel-plugin-macros/blob/main/other/docs/user.md#adding-the-plugin-to-your-config
[@ulyssesrr]: https://github.com/ulyssesrr
[@ulyssesrr.twitter]: https://twitter.com/ulysses2r

[demo-asynchandler]: https://codesandbox.io/s/adoring-browser-z04udr?file=/src/App.js
<!-- prettier-ignore-end -->
