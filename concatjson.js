'use strict'
const thru = require('through2')
const split = require('split2')

function _count (str, c) {
  var count = 0
  for (var i = 0; i < str.length; i += 1) {
    if (str.charAt(i) === c) count += 1
  }
  return count
}

function parse () {
  function parser (dat) {
    if (dat === '') {
      return null
    } else {
      var obj
      try {
        obj = JSON.parse(dat)
      } catch (err) {
        if (err) {
          var open = _count(dat, '{')
          var close = _count(dat, '}')
          if (open === close) dat = `{${dat}}`
          if (open !== close && open > close) dat = `${dat}}`
          if (open !== close && open < close) dat = `{${dat}`
          try {
            obj = JSON.parse(dat)
          } catch (err) {
            this.emit('error', err)
          }
        }
      }
      return obj
    }
  }
  return split('}{', parser)
}

function serialize () {
  return thru.obj((chunk, enc, callback) => {
    try {
      callback(null, JSON.stringify(chunk))
    } catch (err) {
      callback(err)
    }
  })
}

module.exports = {
  parse: parse,
  serialize: serialize,
  stringify: serialize
}
