const path = require('path')

const expect = require('expect.js')
const fs = require('fs-extra-promise')
const mkdirp = require('mkdirp-then')
const co = require('co')

const compile = require('../')

const workingDir = path.join(__dirname, 'temp')

describe('compile grammar', () => {
  before(co.wrap(function * () {
    yield fs.emptyDirAsync(workingDir)
  }))

  it('works', co.wrap(function * () {
    const outputPath = path.join(workingDir, 'foo')
    const options = {
      path: outputPath,
      name: 'Hello',
      grammar: `
// Define a grammar called Hello
grammar Hello;
r  : 'hello' ID ;         // match keyword hello followed by an identifier
ID : [a-z]+ ;             // match lower-case identifiers
WS : [ \\t\\r\\n]+ -> skip ; // skip spaces, tabs, newlines
      `
    }
    yield compile(options)
    const stat = yield fs.readdirAsync(outputPath)
    expect(stat).to.contain('Hello.g4')
    expect(stat).to.contain('HelloLexer.js')
    expect(stat).to.contain('HelloParser.js')
  }))

  after(co.wrap(function * () {
    yield fs.emptyDirAsync(workingDir)
  }))
})
