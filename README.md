<div>
<h1>babel-plugin-jsx-on-demand-children</h1>

<p>Utilities for testing babel plugins</p>
</div>

---

<!-- prettier-ignore-start -->
[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]
[![version][version-badge]][package]
[![downloads][downloads-badge]][npmtrends]
[![MIT License][license-badge]][license]

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

This is precisely what this plugin/macro does:
```javascript
<AsyncHandler status={status}>
  <JsxOnDemandChildren>
    <Loading>...</Loading>
    <Success>...</Success>
    <Error>...</Error>
  </JsxOnDemandChildren>
</AsyncHandler>
```
becomes:
```javascript
<AsyncHandler 
  Loading={() => <Loading>...</Loading>} 
  Success={() => <Success>...</Success>}
  Error={() => <Error>...</Error>}>
</AsyncHandler>
```
This is most useful for components written to take advantage of this plugin, in the example above the `AsyncHandler` component could look like this:

```javascript
function AsyncHandler({status, Loading, Success, Error}) {
  return (
    {status === 'loading' && <Loading/>}
    {status === 'success' && <Success/>}
    {status === 'error' && <Error/>}
  );
}
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
const IfComponent = ({children}) = (<>{children}</>);
const ElseComponent = ({children}) = (<>{children}</>);

function Conditional({ condition, If, Else}) {
  return condition ? (<If />) : (<Else />);
}

export { Conditional, IfComponent as If, ElseComponent as Else };
```

Use with `<JsxOnDemandChildren>`:
```javascript
import { Conditional, If, Else } from './Conditional';

function SomeComponet() {
  return (
    <Conditional condition={isOk}>
      <JsxOnDemandChildren>
        <If>
          <Text>Everything is fine!</Text>
        </If>
        <Else>
          <Text>We have a problem!</Text>
        </Else>
      </JsxOnDemandChildren>
    </Conditional>
  );
}
```

## LICENSE

MIT

<!-- prettier-ignore-start -->
[npm]: https://www.npmjs.com
[node]: https://nodejs.org
[build-badge]: https://img.shields.io/travis/babel-utils/babel-plugin-jsx-on-demand-children.svg?style=flat-square
[build]: https://travis-ci.org/babel-utils/babel-plugin-jsx-on-demand-children
[coverage-badge]: https://img.shields.io/codecov/c/github/babel-utils/babel-plugin-jsx-on-demand-children.svg?style=flat-square
[coverage]: https://codecov.io/github/babel-utils/babel-plugin-jsx-on-demand-children
[version-badge]: https://img.shields.io/npm/v/babel-plugin-jsx-on-demand-children.svg?style=flat-square
[package]: https://www.npmjs.com/package/babel-plugin-jsx-on-demand-children
[downloads-badge]: https://img.shields.io/npm/dm/babel-plugin-jsx-on-demand-children.svg?style=flat-square
[npmtrends]: https://www.npmtrends.com/babel-plugin-jsx-on-demand-children
[license-badge]: https://img.shields.io/npm/l/babel-plugin-jsx-on-demand-children.svg?style=flat-square
[license]: https://github.com/babel-utils/babel-plugin-jsx-on-demand-children/blob/master/other/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/babel-utils/babel-plugin-jsx-on-demand-children/blob/master/other/CODE_OF_CONDUCT.md
[emojis]: https://github.com/all-contributors/all-contributors#emoji-key
[all-contributors]: https://github.com/all-contributors/all-contributors

[jsx-control-statements]: https://github.com/AlexGilleran/jsx-control-statements
[babel-plugin-macros]: https://github.com/kentcdodds/babel-plugin-macros
[babel-plugin-macros.config]: https://github.com/kentcdodds/babel-plugin-macros/blob/main/other/docs/user.md#adding-the-plugin-to-your-config
[@ulyssesrr]: https://github.com/ulyssesrr
[@ulyssesrr.twitter]: https://twitter.com/ulysses2r
<!-- prettier-ignore-end -->
