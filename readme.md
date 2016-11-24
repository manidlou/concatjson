#concatjson

[![travis](https://img.shields.io/travis/mawni/concatjson/master.svg)](https://travis-ci.org/mawni/concatjson) [![npm](https://img.shields.io/npm/v/concatjson.svg?maxAge=2592000?style=flat-square)](https://www.npmjs.com/package/concatjson)

<a href="https://github.com/feross/standard"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100"></a>

_Inspired by [https://github.com/maxogden/ndjson](https://github.com/maxogden/ndjson)_

`concatjson` is [concatenated JSON](https://en.wikipedia.org/wiki/JSON_Streaming) streaming parser/serializer + appender for [node.js](https://nodejs.org).

###Install

`npm i concatjson`

###Streaming

**concatjson.parse()**

 * `@return` {[Stream.Transform](https://nodejs.org/api/stream.html#stream_class_stream_transform)} a Transform stream

parses concatenated JSON stream and emits javascript objects.

_`somefile (contains concatenated JSON objects)`_

```js
{"foo":"bar"}{"qux":"corge"}{"baz":{"waldo":"thud"}}
```

```js
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

 * `@return` {[Stream.Transform](https://nodejs.org/api/stream.html#stream_class_stream_transform)} a Transform stream

serializes data and emits stringified JSON objects.

```js
const cj = require('concatjson')
var ser = cj.serialize()
ser.write({foo: 'bar'})
ser.end()
ser.on('data', (dat) => {
  // dat is stringified JSON
})
```

###Appending

You can use this function to append either an object, or contents (concatenated JSON objects) of a file, to another file.

**concatjson.append(file, data, cb)**

 * `file` `{String}` file path
 * `data` `{Object | String}`
  * `{Object}` an object
  * `{String}` path to another file
 * `cb` `{Function}`
  * `err` `{Error | null}`

appends `data` to `file`, returns `cb` with `err` or `null`. If `data` is a string, it must be path to another file.

```js
const cj = require('concatjson')
var file = './somefile'
var dataToAppend = {foo: 'bar'}
cj.append(file, dataToAppend, (err) => {
  if (err) {
    console.error(err)
  } else {
    console.log('appended successfully.')
  }
})
```
```js
const cj = require('concatjson')
var file = './somefile'
var dataToAppend = './anotherfile'
cj.append(file, dataToAppend, (err) => {
  if (err) {
    console.error(err)
  } else {
    console.log('appended successfully.')
  }
})
```
###License
MIT
