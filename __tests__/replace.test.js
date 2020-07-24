const keys = require('lodash/keys');

const replace = require('../replace');

describe('Module information', () => {
  test('Name', () => {
    expect(replace.name).toEqual('replace');
  });

  test('Description', () => {
    expect(replace.description).toEqual('Replaces the entire entry with a the provided replacement text');
  });
});

describe('Transformer', () => {
  test('Name', () => {
    const instance = new replace.Transformer();

    expect(instance.name).toEqual('replace');
  });

  describe('Config', () => {
    test('Default', () => {
      const instance = new replace.Transformer();
      const config = instance.config;

      const config_keys = keys(config).sort();
      const expected = [
        'replacement'
      ];

      expect(config_keys).toEqual(expected);

      expect(config.replacement.name).toEqual('replacement');
      expect(config.replacement.description).toEqual('The replacement text');
      expect(config.replacement.type).toEqual('string');
      expect(config.replacement.value).toEqual('REDACTED');
    });

    test('Override', () => {
      const opts = {
        replacement: 'REPLACEMENT'
      };

      const instance = new replace.Transformer(opts);
      const config = instance.config;

      expect(config.replacement.value).toEqual('REPLACEMENT');
    });
  });

  describe('Transform', () => {
    test('Default', () => {
      const instance = new replace.Transformer();
      const data = 'This is sample data';

      expect(instance.transform(data)).toEqual('REDACTED');
    });

    test('Override', () => {
      const opts = {
        replacement: 'REPLACEMENT'
      };
      const instance = new replace.Transformer(opts);
      const data = 'This is sample data';

      expect(instance.transform(data)).toEqual('REPLACEMENT');
    });
  });
});