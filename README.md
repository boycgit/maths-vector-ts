# maths-vector-ts

[![Build Status](https://travis-ci.org/boycgit/maths-vector-ts.svg?branch=master)](https://travis-ci.org/boycgit/maths-vector-ts) [![Coverage Status](https://coveralls.io/repos/github/boycgit/maths-vector-ts/badge.svg?branch=master)](https://coveralls.io/github/boycgit/maths-vector-ts?branch=master) [![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php) [![npm version](https://badge.fury.io/js/maths-vector-ts.svg)](https://badge.fury.io/js/maths-vector-ts)

This is TypeScript version of [maths-vectors](https://github.com/boycgit/maths-vector-ts.git).

## Installation

### Node.js / Browserify

```bash
npm install vector --save
```

```javascript
var Vector = require('vector');
var vec = new Vector(42, 1337);
```

### Global object

Include the pre-built script.

```html
<script src="./dist/vector.umd.min.js"></script>
<script>
var vec = new Vector(42, 1337);
</script>
```

## Build & test

```bash
npm run build
```

```bash
npm test
```

## document

```bash
npm run doc
```

then open the generated `out/index.html` file in your browser.

## License

[MIT](LICENSE).
