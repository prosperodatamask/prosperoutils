const utils = require('../../utils');

describe('Transform Option', () => {
  test('No Default', () => {
    const name = 'TEST_NAME';
    const display_name = 'TEST DISPLAY NAME';
    const description = 'TEST DESCRIPTION';
    const type = 'string';

    const transformer_option = new utils.TransformerOption(name, display_name, description, type);

    expect(transformer_option.name).toEqual(name);
    expect(transformer_option.display_name).toEqual(display_name);
    expect(transformer_option.description).toEqual(description);
    expect(transformer_option.type).toEqual(type);
    expect(transformer_option.value).toBeUndefined();
  });

  test('Default', () => {
    const name = 'TEST_NAME';
    const display_name = 'TEST DISPLAY NAME';
    const description = 'TEST DESCRIPTION';
    const type = 'string';
    const default_value = 'DEFAULT VALUE';

    const transformer_option = new utils.TransformerOption(name, display_name, description, type, undefined, default_value);
    transformer_option.check();

    expect(transformer_option.name).toEqual(name);
    expect(transformer_option.display_name).toEqual(display_name);
    expect(transformer_option.description).toEqual(description);
    expect(transformer_option.type).toEqual(type);
    expect(transformer_option.value).toEqual(default_value);
  });

  test('Check', () => {
    const name = 'TEST_NAME';
    const display_name = 'TEST DISPLAY NAME';
    const description = 'TEST DESCRIPTION';
    const type = 'string';
    const check = jest.fn();
    const default_value = 'DEFAULT VALUE';

    const transformer_option = new utils.TransformerOption(name, display_name, description, type, check, default_value);
    transformer_option.check();

    expect(transformer_option.name).toEqual(name);
    expect(transformer_option.display_name).toEqual(display_name);
    expect(transformer_option.description).toEqual(description);
    expect(transformer_option.type).toEqual(type);
    expect(transformer_option.value).toEqual(default_value);
    expect(check).toBeCalledTimes(1);
  });
});

describe('Transformer', () => {
  test('No Config / No Options', () => {
    const name = 'TEST_NAME';

    const transformer = new utils.Transformer(name);
    expect(transformer.name).toEqual(name);
    expect(transformer.config).toEqual({});
    expect(transformer.transform()).toBeUndefined();
  });
  test('No Config / Options', () => {
    const name = 'TEST_NAME';
    const expected_value = 'EXPECTED VALUE';
    const opts = {
      test_option: expected_value
    };

    const transformer = new utils.Transformer(name, undefined, undefined, opts);
    expect(transformer.name).toEqual(name);
    expect(transformer.config).toEqual({});
    expect(transformer.transform()).toBeUndefined();
  });
  test('Config / No Options', () => {
    const name = 'TEST_NAME';

    const config_name = 'TEST_OPTION';
    const config_display_name = 'TEST DISPLAY NAME';
    const config_description = 'TEST_DESCRIPTION';
    const config_type = 'string';

    const config_unset_name = 'UNSET_OPTION';
    const config_unset_display_name = 'UNSET TEST DISPLAY NAME';
    const config_unset_description = 'UNSET_DESCRIPTION';

    const config = [
      new utils.TransformerOption(config_name, config_display_name, config_description, config_type),
      new utils.TransformerOption(config_unset_name, config_unset_display_name, config_unset_description, config_type)
    ];

    const transformer = new utils.Transformer(name, config);
    expect(transformer.name).toEqual(name);
    expect(transformer.config[config_name].name).toEqual(config_name);
    expect(transformer.config[config_name].display_name).toEqual(config_display_name);
    expect(transformer.config[config_name].description).toEqual(config_description);
    expect(transformer.config[config_name].type).toEqual(config_type);
    expect(transformer.config[config_name].value).toBeUndefined();
    expect(transformer.config[config_unset_name].name).toEqual(config_unset_name);
    expect(transformer.config[config_unset_name].display_name).toEqual(config_unset_display_name);
    expect(transformer.config[config_unset_name].description).toEqual(config_unset_description);
    expect(transformer.config[config_unset_name].type).toEqual(config_type);
    expect(transformer.config[config_unset_name].value).toBeUndefined();
    expect(transformer.transform()).toBeUndefined();
  });
  test('Config / Options', () => {
    const name = 'TEST_NAME';
    const expected_value = 'EXPECTED VALUE';

    const config_name = 'TEST_OPTION';
    const config_display_name = 'TEST DISPLAY NAME';
    const config_description = 'TEST_DESCRIPTION';
    const config_type = 'string';
    const config_check = jest.fn();

    const config_unset_name = 'UNSET_OPTION';
    const config_unset_display_name = 'UNSET TEST DISPLAY NAME';
    const config_unset_description = 'UNSET_DESCRIPTION';

    const config = [
      new utils.TransformerOption(config_name, config_display_name, config_description, config_type, config_check),
      new utils.TransformerOption(config_unset_name, config_unset_display_name, config_unset_description, config_type)
    ];

    const opts = {
      [config_name]: expected_value,
      bogus_option: 'This should not matter'
    };

    const transformer = new utils.Transformer(name, config, opts);
    expect(transformer.name).toEqual(name);
    expect(transformer.config[config_name].name).toEqual(config_name);
    expect(transformer.config[config_name].display_name).toEqual(config_display_name);
    expect(transformer.config[config_name].description).toEqual(config_description);
    expect(transformer.config[config_name].type).toEqual(config_type);
    expect(transformer.config[config_name].value).toEqual(expected_value);
    expect(transformer.config[config_unset_name].name).toEqual(config_unset_name);
    expect(transformer.config[config_unset_name].display_name).toEqual(config_unset_display_name);
    expect(transformer.config[config_unset_name].description).toEqual(config_unset_description);
    expect(transformer.config[config_unset_name].type).toEqual(config_type);
    expect(transformer.config[config_unset_name].value).toBeUndefined();
    expect(transformer.transform()).toBeUndefined();
  });

  describe('Dump Config', () => {
    test('No Config', () => {
      /**
       * Transformer for the test
       */
      class TestTransformer extends utils.Transformer {}

      const instance = new TestTransformer('TEST');
      expect(instance.dumpConfig()).toEqual({});
    });

    test('Check', () => {
      const check1 = jest.fn();
      const check2 = jest.fn();
      const options = [
        {
          name: 'TEST_OPTION1',
          check: check1
        },
        {
          name: 'TEST_OPTION2',
          check: check2
        }
      ];

      const instance = new utils.Transformer('TEST', options);
      instance.check();

      expect(check1).toHaveBeenCalled();
      expect(check2).toHaveBeenCalled();
    });

    test('Has Config', () => {
      /**
       * Transformer for the test
       */
      class TestTransformer extends utils.Transformer {}
      const options = [
        {
          name: 'test',
          type: 'integer',
          default: 30
        }
      ];

      const expected_results = {
        test: 30
      };

      const instance = new TestTransformer('TEST', options);
      expect(instance.dumpConfig()).toEqual(expected_results);
    });
  });
});