module.exports = () => {
  return {
    files: [
      {pattern: 'node_modules/sinon/pkg/sinon.js', instrument: false, load: true},
      {pattern: 'node_modules/chai/chai.js', instrument: false, load: true},
      {pattern: 'src/*.js', load: false},
      {pattern: 'node_modules/@dannymoerkerke/material-webcomponents/src/*.js', instrument: false, load: false},
      {pattern: 'test/mocks/*.js', load: true}
    ],
    tests: ['test/*.test.js'],

    env: {
      kind: 'chrome'
    },

    testFramework: 'mocha',

    debug: true,

    setup() {
      window.expect = chai.expect;
      window.assert = chai.assert;
    }
  };
};
