'use strict'
const thru = require('through2')
const split = require('split2')

function parse () {
  function parseStream (dat) {
    if (!dat) return null
    let obj
    try {
      obj = JSON.parse(dat)
    } catch (err) {
      const open = _count(dat, '{')
      const close = _count(dat, '}')
      if (open === close) dat = `{${dat}}`
      else if (open > close) dat = `${dat}}`
      else dat = `{${dat}`
      try {
        obj = JSON.parse(dat)
      } catch (err) {
        this.emit('error', err)
      }
    }
    return obj
  }
  return split('}{', parseStream)
}

function serialize () {
  return thru.obj((chunk, enc, cb) => {
    try {
      return cb(null, JSON.stringify(chunk))
    } catch (err) {
      return cb(err)
    }
  })
}

function _count (str, c) {
  let count = 0
  for (let i = 0; i < str.length; i += 1) {
    if (str.charAt(i) === c) count += 1
  }
  return count
}

module.exports = {
  parse: parse,
  serialize: serialize,
  stringify: serialize
}
