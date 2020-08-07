const keys = require('lodash/keys');

const salesforceid = require('../../salesforce/id');

describe('Module information', () => {
  test('Name', () => {
    expect(salesforceid.name).toEqual('salesforceid');
  });

  test('Display Name', () => {
    expect(salesforceid.display_name).toEqual('Salesforce Id');
  });

  test('Description', () => {
    expect(salesforceid.description).toEqual('Replacement for Salesforce Ids');
  });
});

describe('Transformer', () => {
  test('Name', () => {
    const instance = new salesforceid.Transformer();

    expect(instance.name).toEqual('salesforceid');
  });

  describe('Config', () => {
    test('Default', () => {
      const instance = new salesforceid.Transformer();
      const config = instance.config;

      const config_keys = keys(config).sort();
      const expected = [
        'mask',
        'masklength',
        'normalizelength',
        'preserveobjectkey'
      ];

      expect(config_keys).toEqual(expected);

      expect(config.preserveobjectkey.name).toEqual('preserveobjectkey');
      expect(config.preserveobjectkey.display_name).toEqual('Preserve Object Key');
      expect(config.preserveobjectkey.description).toEqual('Preserve the object key at the start of the Id');
      expect(config.preserveobjectkey.type).toEqual('boolean');
      expect(config.preserveobjectkey.value).toBeTruthy();

      expect(config.mask.name).toEqual('mask');
      expect(config.mask.display_name).toEqual('Mask');
      expect(config.mask.description).toEqual('The data to replace the Id with');
      expect(config.mask.type).toEqual('string');
      expect(config.mask.value).toEqual('X');

      expect(config.masklength.name).toEqual('masklength');
      expect(config.masklength.display_name).toEqual('Mask Length');
      expect(config.masklength.description).toEqual('The number of characters to mask in the Id from the end');
      expect(config.masklength.type).toEqual('number');
      expect(config.masklength.value).toEqual(6);

      expect(config.normalizelength.name).toEqual('normalizelength');
      expect(config.normalizelength.display_name).toEqual('Normalize Length');
      expect(config.normalizelength.description).toEqual('Normalized the Id length to 18 characters');
      expect(config.normalizelength.type).toEqual('boolean');
      expect(config.normalizelength.value).toBeTruthy();
    });
  });

  describe('Check', () => {
    describe('Mask', () => {
      test('Valid', () => {
        const instance = new salesforceid.Transformer();
        instance.config.mask.value = 'I AM VALID';

        expect(() => {
          instance.check();
        }).not.toThrow();
      });

      test('Invalid', () => {
        const instance = new salesforceid.Transformer();
        instance.config.mask.value = '';

        expect(() => {
          instance.check();
        }).toThrowError(new Error('mask is empty'));
      });
    });
  });

  describe('Transform', () => {
    describe('Default', () => {
      test('15 Characters', () => {
        const instance = new salesforceid.Transformer();
        const data = '0018A00000Q9Fuo';

        expect(instance.transform(data)).toEqual('0018A00000Q9XXXXXX');
      });

      test('18 Characters', () => {
        const instance = new salesforceid.Transformer();
        const data = '0018A00000Q9FuoQAF';

        expect(instance.transform(data)).toEqual('0018A00000Q9XXXXXX');
      });

      test('21 Characters', () => {
        const instance = new salesforceid.Transformer();
        const data = '0018A00000Q9FuoQAFYs3';

        expect(instance.transform(data)).toEqual('0018A00000Q9XXXXXX');
      });
    });

    describe('Preserve Object Key', () => {
      test('False', () => {
        const opts = {
          preserveobjectkey: false,
          masklength: 18
        };
        const instance = new salesforceid.Transformer(opts);
        const data = '0018A00000Q9FuoQAF';

        expect(instance.transform(data)).toEqual('XXXXXXXXXXXXXXXXXX');
      });

      test('True', () => {
        const opts = {
          masklength: 18
        };
        const instance = new salesforceid.Transformer(opts);
        const data = '0018A00000Q9FuoQAF';

        expect(instance.transform(data)).toEqual('001XXXXXXXXXXXXXXX');
      });
    });

    describe('Mask', () => {
      test('Single Character', () => {
        const opts = {
          mask: 'Y'
        };
        const instance = new salesforceid.Transformer(opts);
        const data = '0018A00000Q9FuoQAF';

        expect(instance.transform(data)).toEqual('0018A00000Q9YYYYYY');
      });

      test('Multiple Characters', () => {
        const opts = {
          mask: 'ACCOUNT'
        };
        const instance = new salesforceid.Transformer(opts);
        const data = '0018A00000Q9FuoQAF';

        expect(instance.transform(data)).toEqual('0018A00000Q9ACCOUN');
      });
    });

    describe('Mask Length', () => {
      test('Override', () => {
        const opts = {
          masklength: 8
        };
        const instance = new salesforceid.Transformer(opts);
        const data = '0018A00000Q9FuoQAF';

        expect(instance.transform(data)).toEqual('0018A00000XXXXXXXX');
      });

      test('Too long', () => {
        const opts = {
          masklength: 30
        };
        const instance = new salesforceid.Transformer(opts);
        const data = '0018A00000Q9FuoQAF';

        expect(instance.transform(data)).toEqual('001XXXXXXXXXXXXXXX');
      });
    });

    describe('Normalize Length', () => {
      test('False', () => {
        const opts = {
          normalizelength: false
        };
        const instance = new salesforceid.Transformer(opts);
        const data = '0018A00000Q9Fuo';

        expect(instance.transform(data)).toEqual('0018A0000XXXXXX');
      });
    });
  });
});