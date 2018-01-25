'use strict'
const thru = require('through2')
const split = require('split2')

function parse () {
  return split(/}\s*{/, parseStream)

  function parseStream (dat) {
    if (!dat) return null
    let obj
    try {
      obj = JSON.parse(dat)
    } catch (err) {
      const open = count(dat, '{')
      const close = count(dat, '}')
      if (open > close) dat = `${dat}}`
      else if (open < close) dat = `{${dat}`
      else dat = `{${dat}}`
      try {
        obj = JSON.parse(dat)
      } catch (err) {
        this.emit('error', err)
      }
    }
    return obj
  }

  function count (str, ch) {
    let c = 0
    let inContent = false
    for (let i = 0; i < str.length; i += 1) {
      if (str.charAt(i) === '"') {
        if (!(i > 0 && str.charAt(i - 1) === '\\')) inContent = !inContent
      } else if (str.charAt(i) === ch && !inContent) c += 1
    }
    return c
  }
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

module.exports = {
  parse: parse,
  serialize: serialize,
  stringify: serialize
}
