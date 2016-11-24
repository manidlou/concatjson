'use strict'
const fs = require('fs')
const path = require('path')
const os = require('os')
const rimraf = require('rimraf')
const cjs = require('../')
var test = require('tape')
var testdir

test.onFinish(() => {
  rimraf.sync(testdir)
})

test('+ parse() > when nested object is the first item - should parse concatenated JSON stream and emit JSON objects', (t) => {
  var obj1 = {id: 1, name: 'one', more: {has: 'nested', stuff: {foo: 'bar'}}}
  var obj2 = {id: 2, name: 'two'}
  var obj3 = {id: 3, name: 'three'}
  var ser = cjs.serialize()
  ser.write(obj1)
  ser.write(obj2)
  ser.write(obj3)
  ser.end()
  var parser = cjs.parse()
  ser.pipe(parser)
  parser.on('error', (err) => {
    t.error(err)
  })
  parser.once('data', (dat) => {
    t.equal(dat.id, obj1.id)
    t.equal(dat.name, obj1.name)
    t.deepEqual(dat.more, obj1.more)
    t.deepEqual(dat.more.stuff, obj1.more.stuff)
    parser.once('data', (dat) => {
      t.equal(dat.id, obj2.id)
      t.equal(dat.name, obj2.name)
      parser.once('data', (dat) => {
        t.equal(dat.id, obj3.id)
        t.equal(dat.name, obj3.name)
        t.end()
      })
    })
  })
})

test('+ parse() > when nested object is the last item - should parse concatenated JSON stream and emit JSON objects', (t) => {
  var obj1 = {id: 1, name: 'one'}
  var obj2 = {id: 2, name: 'two'}
  var obj3 = {id: 3, name: 'three', more: {has: 'nested', stuff: {foo: 'bar'}}}
  var ser = cjs.serialize()
  ser.write(obj1)
  ser.write(obj2)
  ser.write(obj3)
  ser.end()
  var parser = cjs.parse()
  ser.pipe(parser)
  parser.on('error', (err) => {
    t.error(err)
  })
  parser.once('data', (dat) => {
    t.equal(dat.id, obj1.id)
    t.equal(dat.name, obj1.name)
    parser.once('data', (dat) => {
      t.equal(dat.id, obj2.id)
      t.equal(dat.name, obj2.name)
      parser.once('data', (dat) => {
        t.equal(dat.id, obj3.id)
        t.equal(dat.name, obj3.name)
        t.deepEqual(dat.more, obj3.more)
        t.deepEqual(dat.more.stuff, obj3.more.stuff)
        t.end()
      })
    })
  })
})

test('+ parse() > when nested object is neither the first nor the last item - should parse concatenated JSON stream and emit JSON objects', (t) => {
  var obj1 = {id: 1, name: 'one'}
  var obj2 = {id: 2, name: 'two', more: {has: 'nested', stuff: {foo: 'bar'}}}
  var obj3 = {id: 3, name: 'three'}
  var ser = cjs.serialize()
  ser.write(obj1)
  ser.write(obj2)
  ser.write(obj3)
  ser.end()
  var parser = cjs.parse()
  ser.pipe(parser)
  parser.on('error', (err) => {
    t.error(err)
  })
  parser.once('data', (dat) => {
    t.equal(dat.id, obj1.id)
    t.equal(dat.name, obj1.name)
    parser.once('data', (dat) => {
      t.equal(dat.id, obj2.id)
      t.equal(dat.name, obj2.name)
      t.deepEqual(dat.more, obj2.more)
      t.deepEqual(dat.more.stuff, obj2.more.stuff)
      parser.once('data', (dat) => {
        t.equal(dat.id, obj3.id)
        t.equal(dat.name, obj3.name)
        t.end()
      })
    })
  })
})

test('+ parse() > when data has multiple nested objects - should parse concatenated JSON stream and emit JSON objects', (t) => {
  var obj1 = {id: 1, name: 'one', more: {has: 'nested', stuff: {corge: {thud: 'waldo'}}}}
  var obj2 = {id: 2, name: 'two', more: {has: 'nested', stuff: {foo: 'bar'}}}
  var obj3 = {id: 3, name: 'three', more: {has: 'nested', stuff: {baz: 'qux'}}}
  var ser = cjs.serialize()
  ser.write(obj1)
  ser.write(obj2)
  ser.write(obj3)
  ser.end()
  var parser = cjs.parse()
  ser.pipe(parser)
  parser.on('error', (err) => {
    t.error(err)
  })
  parser.once('data', (dat) => {
    t.equal(dat.id, obj1.id)
    t.equal(dat.name, obj1.name)
    t.deepEqual(dat.more, obj1.more)
    t.deepEqual(dat.more.stuff, obj1.more.stuff)
    parser.once('data', (dat) => {
      t.equal(dat.id, obj2.id)
      t.equal(dat.name, obj2.name)
      t.deepEqual(dat.more, obj2.more)
      t.deepEqual(dat.more.stuff, obj2.more.stuff)
      parser.once('data', (dat) => {
        t.equal(dat.id, obj3.id)
        t.equal(dat.name, obj3.name)
        t.deepEqual(dat.more, obj3.more)
        t.deepEqual(dat.more.stuff, obj3.more.stuff)
        t.end()
      })
    })
  })
})

test('+ serialize() > should serialize data and emit stringified JSON objects', (t) => {
  var obj1 = {id: 1, name: 'one', more: {has: 'nested', stuff: {corge: {thud: 'waldo'}}}}
  var obj2 = {id: 2, name: 'two', more: {has: 'nested', stuff: {foo: 'bar'}}}
  var ser = cjs.serialize()
  ser.write(obj1)
  ser.write(obj2)
  ser.end()
  ser.on('error', (err) => {
    t.error(err)
  })
  ser.once('data', (dat) => {
    t.deepEqual(dat, JSON.stringify(obj1))
    ser.once('data', (dat) => {
      t.deepEqual(dat, JSON.stringify(obj2))
      t.end()
    })
  })
})

test('+ append() > when data is an object - should append stringified JSON objects to the file', (t) => {
  testdir = path.join(os.tmpdir(), 'test-concatjson')
  rimraf.sync(testdir)
  fs.mkdirSync(testdir)
  var file = path.join(testdir, 'somefile')
  var obj1 = {id: 1, name: 'one', more: {has: 'nested', stuff: {corge: {thud: 'waldo'}}}}
  var obj2 = {id: 2, name: 'two', more: {has: 'nested', stuff: {foo: 'bar'}}}
  var obj3 = {id: 3, name: 'three', more: {has: 'nested', stuff: {baz: 'qux'}}}
  var ser = cjs.serialize()
  ser.write(obj1)
  ser.write(obj2)
  ser.end()
  ser.pipe(fs.createWriteStream(file)).on('error', (err) => {
    t.error(err)
  }).on('finish', () => {
    cjs.append(file, obj3, (err) => {
      t.error(err, 'should be null')
      var parser = cjs.parse()
      fs.createReadStream(file).pipe(parser)
      parser.on('error', (err) => {
        t.error(err)
      })
      parser.once('data', (dat) => {
        t.equal(dat.id, obj1.id)
        t.equal(dat.name, obj1.name)
        t.deepEqual(dat.more, obj1.more)
        t.deepEqual(dat.more.stuff, obj1.more.stuff)
        parser.once('data', (dat) => {
          t.equal(dat.id, obj2.id)
          t.equal(dat.name, obj2.name)
          t.deepEqual(dat.more, obj2.more)
          t.deepEqual(dat.more.stuff, obj2.more.stuff)
          parser.once('data', (dat) => {
            t.equal(dat.id, obj3.id)
            t.equal(dat.name, obj3.name)
            t.deepEqual(dat.more, obj3.more)
            t.deepEqual(dat.more.stuff, obj3.more.stuff)
            t.end()
          })
        })
      })
    })
  })
})

test('+ append() > when data is another file - should append the file contents to the other one', (t) => {
  testdir = path.join(os.tmpdir(), 'test-concatjson')
  rimraf.sync(testdir)
  fs.mkdirSync(testdir)
  var file1 = path.join(testdir, 'somefile1')
  var file2 = path.join(testdir, 'somefile2')
  var obj1 = {id: 1, name: 'one', more: {has: 'nested', stuff: {foo: 'bar'}}}
  var obj2 = {id: 2, name: 'two', more: {has: 'nested', stuff: {baz: 'qux'}}}
  var ser = cjs.serialize()
  ser.write(obj1)
  ser.end()
  ser.pipe(fs.createWriteStream(file1)).on('error', (err) => {
    t.error(err, 'should be null')
  }).on('finish', () => {
    var ser = cjs.serialize()
    ser.write(obj2)
    ser.end()
    ser.pipe(fs.createWriteStream(file2)).on('error', (err) => {
      t.error(err, 'should be null')
    }).on('finish', () => {
      var parser = cjs.parse()
      fs.createReadStream(file1).pipe(parser)
      parser.on('error', (err) => {
        t.error(err)
      })
      parser.once('data', (dat) => {
        t.equal(dat.id, obj1.id)
        t.equal(dat.name, obj1.name)
        t.deepEqual(dat.more, obj1.more)
        t.deepEqual(dat.more.stuff, obj1.more.stuff)
        t.notEqual(dat.id, obj2.id)
        t.notEqual(dat.name, obj2.name)
        t.notDeepEqual(dat.more, obj2.more)
        t.notDeepEqual(dat.more.stuff, obj2.more.stuff)
      })
      parser.on('end', () => {
        cjs.append(file1, file2, (err) => {
          t.error(err)
          var parser = cjs.parse()
          fs.createReadStream(file1).pipe(parser)
          parser.on('error', (err) => {
            t.error(err)
          })
          parser.once('data', (dat) => {
            t.equal(dat.id, obj1.id)
            t.equal(dat.name, obj1.name)
            t.deepEqual(dat.more, obj1.more)
            t.deepEqual(dat.more.stuff, obj1.more.stuff)
            parser.once('data', (dat) => {
              t.equal(dat.id, obj2.id)
              t.equal(dat.name, obj2.name)
              t.deepEqual(dat.more, obj2.more)
              t.deepEqual(dat.more.stuff, obj2.more.stuff)
              t.end()
            })
          })
        })
      })
    })
  })
})

test('+ append() > when data is string but not path to another file - should emit ENOENT error', (t) => {
  var file = path.join(testdir, 'somefile')
  var str = `{id: 0, name: 'zero'}`
  cjs.append(file, str, (err) => {
    t.equal(err.code, 'ENOENT')
    t.end()
  })
})
