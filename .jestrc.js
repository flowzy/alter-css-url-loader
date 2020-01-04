const config = require('./package.json')

module.exports = {
  displayName: {
    name: config.name,
    color: 'cyan',
  },
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/', '/test/'],
}
