const Transformer = require('./utils').Transformer;

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
  },
  {
    name: 'matchlength',
    display_name: 'Match Length',
    description: 'Match the length of the input data',
    type: 'boolean',
    default: false
  }
];

/**
 * Replaces the entire length of the string with a fixed value
 */
class Replace extends Transformer {
  /**
   * The constructor
   * @param {Object} opts The module options
   */
  constructor(opts) {
    super(NAME, options, opts);
  }

  /**
   * Transforms the data
   * @param {String} data The data to transform
   * @returns {String} The transformed data
   */
  transform(data) {
    let result = this.config.replacement.value;

    if (this.config.matchlength.value) {
      while (result.length < data.length) {
        result += this.config.replacement.value;
      }

      result = result.substring(0, data.length);
    }

    return result;
  }
}

module.exports = {
  name: NAME,
  display_name: DISPLAY_NAME,
  description: DESCRIPTION,
  Transformer: Replace
};