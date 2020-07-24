const keys = require('lodash/keys');
const pull = require('lodash/pull');

const prospero = require('../index');

describe('Modules', () => {
  test('Names', () => {
    const module_keys = pull(keys(prospero).sort(), 'listModules');
    const expected = [
      'copy',
      'replace'
    ];

    expect(module_keys).toEqual(expected);
  });
});

describe('List Modules', () => {
  test('Expected modules', () => {
    const module_keys = keys(prospero.listModules()).sort();
    const expected = [
      'copy',
      'replace'
    ];

    expect(module_keys).toEqual(expected);
  });
});