const Transformer = require('./utils').Transformer;
const TransformerOption = require('./utils').TransformerOption;

const NAME = 'replace';
const DISPLAY_NAME = 'Replacer';
const DESCRIPTION = 'Replaces the entire entry with a the provided replacement text';

const options = [
  {
    name: 'replacement',
    display_name: 'Replacement Text',
    description: 'The replacement text',
    type: 'string',
    default: 'REDACTED'
  }
];

const config = [];

options.forEach(option => {
  config.push(new TransformerOption(
    option.name,
    option.display_name,
    option.description,
    option.type,
    option.default
  ));
});

/**
 * Replaces the entire length of the string with a fixed value
 */
class Replace extends Transformer {
  /**
   * The constructor
   * @param {Object} opts The module options
   */
  constructor(opts) {
    super(NAME, config, opts);
  }

  /**
   * Transforms the data
   * @returns {String} The transformed data
   */
  transform() {
    return this.config.replacement.value;
  }
}

module.exports = {
  name: NAME,
  display_name: DISPLAY_NAME,
  description: DESCRIPTION,
  Transformer: Replace
};