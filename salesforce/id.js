const Transformer = require('../utils').Transformer;

const NAME = 'salesforceid';
const DISPLAY_NAME = 'Salesforce Id';
const DESCRIPTION = 'Replacement for Salesforce Ids';

const KEY_LENGTH = 3;
const ID_LENGTH = 18;

const options = [
  {
    name: 'preserveobjectkey',
    display_name: 'Preserve Object Key',
    description: 'Preserve the object key at the start of the Id',
    type: 'boolean',
    default: true
  },
  {
    name: 'mask',
    display_name: 'Mask',
    description: 'The data to replace the Id with',
    type: 'string',
    default: 'X'
  },
  {
    name: 'masklength',
    display_name: 'Mask Length',
    description: 'The number of characters to mask in the Id from the end',
    type: 'number',
    default: 6
  },
  {
    name: 'normalizelength',
    display_name: 'Normalize Length',
    description: `Normalized the Id length to ${ID_LENGTH} characters`,
    type: 'boolean',
    default: true
  }
];

/**
 * Modifies Salesforce Ids
 */
class SalesforceId extends Transformer {
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
    let mask_length = this.config.masklength.value;
    let result = data;

    if (mask_length > ID_LENGTH) {
      mask_length = ID_LENGTH;
    }

    if (this.config.normalizelength.value) {
      while (result.length < ID_LENGTH) {
        result += this.config.mask.value;
      }

      result = result.substring(0, ID_LENGTH);
    }

    if (
      this.config.preserveobjectkey.value &&
      mask_length + KEY_LENGTH > ID_LENGTH
    ) {
      const overage = mask_length + KEY_LENGTH - ID_LENGTH;
      mask_length -= overage;
    }

    result = result.substring(0, result.length - mask_length);

    const final_length = this.config.normalizelength.value ? ID_LENGTH : data.length;

    while (result.length < final_length) {
      result += this.config.mask.value;
    }

    return result.substring(0, ID_LENGTH);
  }
}

module.exports = {
  name: NAME,
  display_name: DISPLAY_NAME,
  description: DESCRIPTION,
  Transformer: SalesforceId
};