'use strict'
const cj = require('../')
const test = require('tape')

test('+ parse() > when nested object is the first item - should parse concatenated JSON stream and emit JSON objects', t => {
  const obj1 = { id: 1, name: 'one', more: { has: 'nested', stuff: { foo: 'bar' } } }
  const obj2 = { id: 2, name: 'two' }
  const obj3 = { id: 3, name: 'three' }
  const ser = cj.serialize()
  ser.write(obj1)
  ser.write(obj2)
  ser.write(obj3)
  ser.end()
  const parser = cj.parse()
  ser.pipe(parser)
  parser.on('error', err => {
    t.error(err)
  })
  parser.once('data', dat => {
    t.equal(dat.id, obj1.id)
    t.equal(dat.name, obj1.name)
    t.deepEqual(dat.more, obj1.more)
    t.deepEqual(dat.more.stuff, obj1.more.stuff)
    parser.once('data', dat => {
      t.equal(dat.id, obj2.id)
      t.equal(dat.name, obj2.name)
      parser.once('data', dat => {
        t.equal(dat.id, obj3.id)
        t.equal(dat.name, obj3.name)
        t.end()
      })
    })
  })
})

test('+ parse() > when nested object is the last item - should parse concatenated JSON stream and emit JSON objects', t => {
  const obj1 = { id: 1, name: 'one' }
  const obj2 = { id: 2, name: 'two' }
  const obj3 = { id: 3, name: 'three', more: { has: 'nested', stuff: { foo: 'bar' } } }
  const ser = cj.serialize()
  ser.write(obj1)
  ser.write(obj2)
  ser.write(obj3)
  ser.end()
  const parser = cj.parse()
  ser.pipe(parser)
  parser.on('error', err => {
    t.error(err)
  })
  parser.once('data', dat => {
    t.equal(dat.id, obj1.id)
    t.equal(dat.name, obj1.name)
    parser.once('data', dat => {
      t.equal(dat.id, obj2.id)
      t.equal(dat.name, obj2.name)
      parser.once('data', dat => {
        t.equal(dat.id, obj3.id)
        t.equal(dat.name, obj3.name)
        t.deepEqual(dat.more, obj3.more)
        t.deepEqual(dat.more.stuff, obj3.more.stuff)
        t.end()
      })
    })
  })
})

test('+ parse() > when nested object is neither the first nor the last item - should parse concatenated JSON stream and emit JSON objects', t => {
  const obj1 = { id: 1, name: 'one' }
  const obj2 = { id: 2, name: 'two', more: { has: 'nested', stuff: { foo: 'bar' } } }
  const obj3 = { id: 3, name: 'three' }
  const ser = cj.serialize()
  ser.write(obj1)
  ser.write(obj2)
  ser.write(obj3)
  ser.end()
  const parser = cj.parse()
  ser.pipe(parser)
  parser.on('error', err => {
    t.error(err)
  })
  parser.once('data', dat => {
    t.equal(dat.id, obj1.id)
    t.equal(dat.name, obj1.name)
    parser.once('data', dat => {
      t.equal(dat.id, obj2.id)
      t.equal(dat.name, obj2.name)
      t.deepEqual(dat.more, obj2.more)
      t.deepEqual(dat.more.stuff, obj2.more.stuff)
      parser.once('data', dat => {
        t.equal(dat.id, obj3.id)
        t.equal(dat.name, obj3.name)
        t.end()
      })
    })
  })
})

test('+ parse() > when data has multiple nested objects - should parse concatenated JSON stream and emit JSON objects', t => {
  const obj1 = { id: 1, name: 'one', more: { has: 'nested', stuff: { corge: { thud: 'waldo' } } } }
  const obj2 = { id: 2, name: 'two', more: { has: 'nested', stuff: { foo: 'bar' } } }
  const obj3 = { id: 3, name: 'three', more: { has: 'nested', stuff: { baz: 'qux' } } }
  const ser = cj.serialize()
  ser.write(obj1)
  ser.write(obj2)
  ser.write(obj3)
  ser.end()
  const parser = cj.parse()
  ser.pipe(parser)
  parser.on('error', err => {
    t.error(err)
  })
  parser.once('data', dat => {
    t.equal(dat.id, obj1.id)
    t.equal(dat.name, obj1.name)
    t.deepEqual(dat.more, obj1.more)
    t.deepEqual(dat.more.stuff, obj1.more.stuff)
    parser.once('data', dat => {
      t.equal(dat.id, obj2.id)
      t.equal(dat.name, obj2.name)
      t.deepEqual(dat.more, obj2.more)
      t.deepEqual(dat.more.stuff, obj2.more.stuff)
      parser.once('data', dat => {
        t.equal(dat.id, obj3.id)
        t.equal(dat.name, obj3.name)
        t.deepEqual(dat.more, obj3.more)
        t.deepEqual(dat.more.stuff, obj3.more.stuff)
        t.end()
      })
    })
  })
})

test('+ serialize() > should serialize data and emit stringified JSON objects', t => {
  const obj1 = { id: 1, name: 'one', more: { has: 'nested', stuff: { corge: { thud: 'waldo' } } } }
  const obj2 = { id: 2, name: 'two', more: { has: 'nested', stuff: { foo: 'bar' } } }
  const ser = cj.serialize()
  ser.write(obj1)
  ser.write(obj2)
  ser.end()
  ser.on('error', err => {
    t.error(err)
  })
  ser.once('data', dat => {
    t.deepEqual(dat, JSON.stringify(obj1))
    ser.once('data', dat => {
      t.deepEqual(dat, JSON.stringify(obj2))
      t.end()
    })
  })
})

test('+ stringify() alias > should serialize data and emit stringified JSON objects', t => {
  const obj1 = { id: 1, name: 'one', more: { has: 'nested', stuff: { corge: { thud: 'waldo' } } } }
  const obj2 = { id: 2, name: 'two', more: { has: 'nested', stuff: { foo: 'bar' } } }
  const ser = cj.stringify()
  ser.write(obj1)
  ser.write(obj2)
  ser.end()
  ser.on('error', err => {
    t.error(err)
  })
  ser.once('data', dat => {
    t.deepEqual(dat, JSON.stringify(obj1))
    ser.once('data', dat => {
      t.deepEqual(dat, JSON.stringify(obj2))
      t.end()
    })
  })
})

test('+ parse() > when >1 JSON objects are in the stream and the nonfirst has a curly bracket in its contents', t => {
  const obj1 = { id: 1, name: 'one', more: { has: 'nested', stuff: { foo: 'bar' } } }
  const obj2 = { id: 2, name: 'two', bracket: '{' }
  const obj3 = { id: 3, name: 'three', bracketWithQuoteBefore: '"{' }
  const ser = cj.serialize()
  ser.write(obj1)
  ser.write(obj2)
  ser.write(obj3)
  ser.end()
  const parser = cj.parse()
  ser.pipe(parser)
  parser.on('error', err => {
    t.error(err)
  })
  parser.once('data', dat => {
    t.equal(dat.id, obj1.id)
    t.equal(dat.name, obj1.name)
    t.deepEqual(dat.more, obj1.more)
    t.deepEqual(dat.more.stuff, obj1.more.stuff)
    parser.once('data', dat => {
      t.equal(dat.id, obj2.id)
      t.equal(dat.name, obj2.name)
      parser.once('data', dat => {
        t.equal(dat.id, obj3.id)
        t.equal(dat.name, obj3.name)
        t.end()
      })
    })
  })
})

test('+ parse() > more curly brackets in object contents', t => {
  const obj1 = { id: 1, name: 'one', bracket: '}' }
  const obj2 = { id: 2, name: 'two', bracketWithQuoteBefore: '"}' }
  const obj3 = { id: 3, name: 'three', bracket: '{}' }
  const obj4 = { id: 4, name: 'four', bracketWithQuoteBefore: '"{}' }
  const ser = cj.serialize()
  ser.write(obj1)
  ser.write(obj2)
  ser.write(obj3)
  ser.write(obj4)
  ser.end()
  const parser = cj.parse()
  ser.pipe(parser)
  parser.on('error', err => {
    t.error(err)
  })
  parser.once('data', dat => {
    t.equal(dat.id, obj1.id)
    t.equal(dat.name, obj1.name)
    parser.once('data', dat => {
      t.equal(dat.id, obj2.id)
      t.equal(dat.name, obj2.name)
      parser.once('data', dat => {
        t.equal(dat.id, obj3.id)
        t.equal(dat.name, obj3.name)
        parser.once('data', dat => {
          t.equal(dat.id, obj4.id)
          t.equal(dat.name, obj4.name)
          t.end()
        })
      })
    })
  })
})

test('+ parse() > test whitespace allowed between concatenated objects', t => {
  const Readable = require('stream').Readable
  const out = new Readable()
  out._read = function noop () {}

  const parser = cj.parse()
  out.pipe(parser)

  /*
   * This is the (second) example from the "Concatenated JSON" section from
   * the Wikipedia article on "JSON Streaming."
   */
  out.push('{"some":"thing\\n"}\n')
  out.push('{"may": {\n')
  out.push('  "include":"nested",\n')
  out.push(' "objects":[\n')
  out.push('      "and","arrays"\n')
  out.push(' ]\n')
  out.push('}}\n')
  out.push(null)

  parser.once('data', dat => {
    t.equal(dat.some, 'thing\n')
    parser.once('data', dat => {
      t.deepEqual(dat.may,
        { include: 'nested', objects: ['and', 'arrays'] })
      t.end()
    })
  })
})
