const keys = require('lodash/keys');

const replace = require('../replace');

describe('Module information', () => {
  test('Name', () => {
    expect(replace.name).toEqual('replace');
  });

  test('Display Name', () => {
    expect(replace.display_name).toEqual('Replacer');
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
        'matchlength',
        'replacement'
      ];

      expect(config_keys).toEqual(expected);

      expect(config.replacement.name).toEqual('replacement');
      expect(config.replacement.display_name).toEqual('Replacement Text');
      expect(config.replacement.description).toEqual('The replacement text');
      expect(config.replacement.type).toEqual('string');
      expect(config.replacement.value).toEqual('REDACTED');

      expect(config.matchlength.name).toEqual('matchlength');
      expect(config.matchlength.display_name).toEqual('Match Length');
      expect(config.matchlength.description).toEqual('Match the length of the input data');
      expect(config.matchlength.type).toEqual('boolean');
      expect(config.matchlength.default).toBeFalsy();
    });

    test('Override', () => {
      const opts = {
        replacement: 'REPLACEMENT'
      };

      const instance = new replace.Transformer(opts);
      const config = instance.config;

      expect(config.replacement.value).toEqual('REPLACEMENT');
    });

    describe('Check', () => {
      describe('Replacement', () => {
        test('Invalid', () => {
          const instance = new replace.Transformer();
          instance.config.replacement.value = '';

          expect(() => {
            instance.check();
          }).toThrowError(new Error('replacement is empty'));
        });
        test('Invalid', () => {
          const instance = new replace.Transformer();
          instance.config.replacement.value = 'I AM VALID';

          expect(() => {
            instance.check();
          }).not.toThrow();
        });
      });
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

    test('Match Length', () => {
      const opts = {
        matchlength: true
      };
      const instance = new replace.Transformer(opts);
      const data = 'This is sample data';
      const expected = 'REDACTEDREDACTEDRED';

      expect(instance.transform(data)).toEqual(expected);
    });
  });
});