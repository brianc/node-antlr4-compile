const fs = require('fs')
const child_process = require('child_process')
const { join, resolve } = require('path')

const mkdirp = require('mkdirp-then')
const co = require('co')
const Promise = require('bluebird')
Promise.promisifyAll(fs)

const exec = (cmd, options) => new Promise((resolve, reject) => {
  child_process.exec(cmd, options, (error, stdout, stderr) => {
    const res = { stdout, stderr, error }
    error ? reject(res) : resolve(res)
  })
})

module.exports = co.wrap(function * ({ name, grammar, path } = {}) {
  const grammarFilePath = join(path, `${name}.g4`)
  yield mkdirp(path)
  yield fs.writeFileAsync(grammarFilePath, grammar)
  const flags = `-Xmx500M -cp $PWD/antlr-4.5-complete.jar:$CLASSPATH org.antlr.v4.Tool -Dlanguage=JavaScript -o ${path}`
  const cmd = `java ${flags} ${grammarFilePath}`
  const res = yield exec(cmd)
  return res
})

if (!module.parent) {
  module.exports({
    name: 'Hello',
    grammar: `
// Define a grammar called Hello
grammar Hello;
r  : 'hello' ID ;         // match keyword hello followed by an identifier
ID : [a-z]+ ;             // match lower-case identifiers
WS : [ \\t\\r\\n]+ -> skip ; // skip spaces, tabs, newlines
    `,
    path: `${__dirname}/hello`,
  }).then(console.log, console.error)
}
