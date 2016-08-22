const child_process = require('child_process')

const co = require('co')
const Promise = require('bluebird')

const exec = (cmd, options) => new Promise((resolve, reject) => {
  child_process.exec(cmd, options, (error, stdout, stderr) => {
    const res = { stdout, stderr, error }
    error ? reject(res) : resolve(res)
  })
})

module.exports = co.wrap(function * ({ grammar, path } = {}) {
  const cmd = `java -Xmx500M -cp $PWD/antlr-4.5-complete.jar:$CLASSPATH org.antlr.v4.Tool`
  const res = yield exec(cmd)
  console.log(res)
})

if (!module.parent) {
  module.exports({
    grammar: `
// Define a grammar called Hello
grammar Hello;
r  : 'hello' ID ;         // match keyword hello followed by an identifier
ID : [a-z]+ ;             // match lower-case identifiers
WS : [ \t\r\n]+ -> skip ; // skip spaces, tabs, newlines
    `,
    path: __dirname,
  })
}
