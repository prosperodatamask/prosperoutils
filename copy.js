const Transformer = require('./utils').Transformer;

const NAME = 'copy';
const DESCRIPTION = 'Copies the contents of the data verbatim';

/**
 * Copies the contents of the data verbatim
 */
class Copy extends Transformer {
  /**
   * The constructor
   */
  constructor() {
    super(NAME);
  }

  /**
   * Outputs the data verbatim
   * @param {Object} data The data
   * @returns {Object} The data
   */
  transform(data) {
    return data;
  }
}

module.exports = {
  name: NAME,
  description: DESCRIPTION,
  Transformer: Copy
};