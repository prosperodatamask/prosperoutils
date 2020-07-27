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

    const transformer_option = new utils.TransformerOption(name, display_name, description, type, default_value);

    expect(transformer_option.name).toEqual(name);
    expect(transformer_option.display_name).toEqual(display_name);
    expect(transformer_option.description).toEqual(description);
    expect(transformer_option.type).toEqual(type);
    expect(transformer_option.value).toEqual(default_value);
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

    const expected_config = {
      [config_name]: {
        name: config_name,
        display_name: config_display_name,
        description: config_description,
        type: config_type,
        value: undefined
      },
      [config_unset_name]: {
        name: config_unset_name,
        display_name: config_unset_display_name,
        description: config_unset_description,
        type: config_type,
        value: undefined
      }
    };

    const transformer = new utils.Transformer(name, config);
    expect(transformer.name).toEqual(name);
    expect(transformer.config).toEqual(expected_config);
    expect(transformer.transform()).toBeUndefined();
  });
  test('Config / Options', () => {
    const name = 'TEST_NAME';
    const expected_value = 'EXPECTED VALUE';

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

    const opts = {
      [config_name]: expected_value,
      bogus_option: 'This should not matter'
    };

    const expected_config = {
      [config_name]: {
        name: config_name,
        display_name: config_display_name,
        description: config_description,
        type: config_type,
        value: expected_value
      },
      [config_unset_name]: {
        name: config_unset_name,
        display_name: config_unset_display_name,
        description: config_unset_description,
        type: config_type,
        value: undefined
      }
    };

    const transformer = new utils.Transformer(name, config, opts);
    expect(transformer.name).toEqual(name);
    expect(transformer.config).toEqual(expected_config);
    expect(transformer.transform()).toBeUndefined();
  });
});