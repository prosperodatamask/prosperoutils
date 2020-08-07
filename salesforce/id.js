const isEmpty = require('lodash/isEmpty');

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
    default: 'X',
    /**
     * Checks to make sure the mask is set
     * @returns {undefined}
     * @throws {Error} If the mask is not set
     */
    check: function () {
      if (isEmpty(this.value)) {
        throw new Error('mask is empty');
      }
    }
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
 * Appends the mask value to the end of the string
 * @param {String} data The starting data
 * @param {Number} length The length to end with
 * @param {String} mask The masking data
 * @returns {String} The appended data
 */
function appendMaskValue(data, length, mask) {
  let result = data;

  while (result.length < length) {
    result += mask;
  }

  return result.substring(0, length);
}

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
    let mask_length = this.config.masklength.value > ID_LENGTH ? ID_LENGTH : this.config.masklength.value;
    let result = data;

    if (this.config.normalizelength.value) {
      result = appendMaskValue(result, ID_LENGTH, this.config.mask.value);
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
    return appendMaskValue(result, final_length, this.config.mask.value);
  }
}

module.exports = {
  name: NAME,
  display_name: DISPLAY_NAME,
  description: DESCRIPTION,
  Transformer: SalesforceId
};