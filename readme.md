#concatjson

[![travis](https://img.shields.io/travis/mawni/concatjson/master.svg)](https://travis-ci.org/mawni/concatjson) [![npm](https://img.shields.io/npm/v/concatjson.svg?maxAge=2592000?style=flat-square)](https://www.npmjs.com/package/concatjson)

<a href="https://github.com/feross/standard"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100"></a>

_Inspired by [https://github.com/maxogden/ndjson](https://github.com/maxogden/ndjson)_

`concatjson` is [concatenated JSON](https://en.wikipedia.org/wiki/JSON_Streaming) streaming parser/serializer for [node.js](https://nodejs.org).

###Install

`npm i concatjson`

###Usage

**concatjson.parse()**

 * `@return` {[Stream.Transform](https://nodejs.org/api/stream.html#stream_class_stream_transform)} a Transform stream

parses concatenated JSON stream and emits javascript objects.

_`somefile (contains concatenated JSON objects)`_

```js
{"foo":"bar"}{"qux":"corge"}{"baz":{"waldo":"thud"}}
```

```js
const fs = require('fs')
const cj = require('concatjson')

fs.createReadStream('./somefile').pipe(cj.parse()).on('error', (err) => {
  console.error(err)
}).on('data', (obj) => {
  // obj is a js object
}).on('end', () => {
  console.log('finished successfully.')
})
```
**concatjson.serialize()**

alias: `concatjson.stringify()`

 * `@return` {[Stream.Transform](https://nodejs.org/api/stream.html#stream_class_stream_transform)} a Transform stream

accepts objects and emits stringified JSON objects.

```js
const cj = require('concatjson')
var ser = cj.serialize()
ser.write({foo: 'bar'})
ser.end()
ser.on('data', (dat) => {
  // dat is stringified JSON
})
```
#####_append object(s) to a file_
```js
const fs = require('fs')
const cj = require('concatjson')

// use flag 'a' for appending
var w = fs.createWriteStream('./somefile', {flags: 'a'})
var ser = cj.serialize()

// listen to all error events
w.on('error', (err) => {
  console.error(err)
})
ser.on('error', (err) => {
  console.error(err)
})

ser.write({foo: 'bar'})
ser.end()
ser.pipe(w).on('finish', () => {
  console.log('appended successfully.')
})
```
###License
MIT
