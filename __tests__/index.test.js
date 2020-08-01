const keys = require('lodash/keys');
const difference = require('lodash/difference');
const map = require('lodash/map');
const uniq = require('lodash/uniq');

const prospero = require('../index');
const prospero_pkg = require('../package.json');
const prosperoutils = require('../index');

describe('Modules', () => {
  test('Names', () => {
    const expected_methods = [
      'dumpConfig',
      'listModules',
      'loadConfig',
      'module_list'
    ];
    const module_keys = difference(keys(prospero).sort(), expected_methods);
    const expected = [
      'copy',
      'replace',
      'salesforceid'
    ];

    expect(module_keys).toEqual(expected);
  });

  test('Unique Names', () => {
    const module_names = map(prospero.module_list, 'name');

    expect(module_names.length).toEqual(uniq(module_names).length);
  });
});

describe('List Modules', () => {
  test('Expected modules', () => {
    const module_keys = keys(prospero.listModules()).sort();
    const expected = [
      'copy',
      'replace',
      'salesforceid'
    ];

    expect(module_keys).toEqual(expected);
  });
});

describe('Dump Config', () => {
  test('Mutiple fields', () => {
    const replace_option = 'TEST_REPLACER';

    const replace_opts = {
      replacement: replace_option
    };

    const field_mapping = {
      'TEST_FIELD_COPY': new prospero.copy.Transformer(),
      'TEST_FIELD_REPLACE': new prospero.replace.Transformer(replace_opts)
    };

    const expected_results = {
      version: prospero_pkg.version,
      field_config: [
        {
          field_name: 'TEST_FIELD_COPY',
          transformer: {
            name: 'copy',
            config: {}
          }
        },
        {
          field_name: 'TEST_FIELD_REPLACE',
          transformer: {
            name: 'replace',
            config: {
              replacement: replace_option
            }
          }
        }
      ]
    };

    expect(prospero.dumpConfig(field_mapping)).toEqual(expected_results);
  });
});

describe('Load Config', () => {
  test('Version Mismatch', () => {
    const config = {
      version: '10000.0.0',
      field_config: []
    };

    expect(() => {
      prospero.loadConfig(config);
    }).toThrowError(new Error('The major version of the config does not match the Prospero Utils major version'));
  });

  test('Multiple Transformers', () => {
    const config = {
      version: prospero_pkg.version,
      field_config: [
        {
          field_name: 'TEST_FIELD_COPY',
          transformer: {
            name: 'copy'
          }
        },
        {
          field_name: 'TEST_FIELD_REPLACE',
          transformer: {
            name: 'replace',
            config: {
              replacement: 'TEST_REPLACER'
            }
          }
        },
        {
          field_name: 'TEST_FIELD_UNKNOWN',
          transformer: {
            name: 'unknown',
            config: {
              ignored: 'this does not matter'
            }
          }
        }
      ]
    };

    const expected_keys = [
      'TEST_FIELD_COPY',
      'TEST_FIELD_REPLACE',
      'TEST_FIELD_UNKNOWN'
    ];

    const field_mapping = prosperoutils.loadConfig(config);

    expect(keys(field_mapping).sort()).toEqual(expected_keys);
    expect(field_mapping.TEST_FIELD_COPY.name).toEqual('copy');
    expect(field_mapping.TEST_FIELD_REPLACE.name).toEqual('replace');
    expect(field_mapping.TEST_FIELD_REPLACE.config.replacement.value).toEqual('TEST_REPLACER');
    expect(field_mapping.TEST_FIELD_UNKNOWN.name).toEqual('copy');
  });
});