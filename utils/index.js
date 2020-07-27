const cloneDeep = require('lodash/cloneDeep');
const has = require('lodash/has');

/**
 * Options for the transformer
 */
class TransformerOption {
  name;
  display_name;
  description;
  type;
  value;

  /**
   * The constructor
   * @param {String} name The name of the option
   * @param {String} display_name The human readable name to display
   * @param {String} description A description for the option
   * @param {String} type The type of the option
   * @param {Object} default_value The default value
   */
  constructor(name, display_name, description, type, default_value) {
    this.name = name;
    this.display_name = display_name;
    this.description = description;
    this.type = type;

    if (default_value) {
      this.value = default_value;
    }
  }
}

/**
 * Transformer base class
 */
class Transformer {
  #name;
  #config;

  /**
   * The construtor
   * @param {String} name The transformer name
   * @param {TransformerOption[]} config The configuration
   * @param {Object} opts The configuration options
   * @returns {undefined}
   */
  constructor(name, config, opts) {
    this.#name = name;
    this.#config = {};

    if (config !== undefined) {
      config.forEach(value => {
        this.#config[value.name] = cloneDeep(value);

        if (
          has(opts, value.name) &&
          typeof opts[value.name] === value.type
        ) {
          this.#config[value.name].value = opts[value.name];
        }
      });
    }
  }

  /**
   * Gets the transformer's name
   * @returns {String} The name of the transformer
   */
  get name() {
    return this.#name;
  }

  /**
   * Gets the current configuration
   * @returns {Option} The configuration
   */
  get config() {
    return this.#config;
  }

  /**
   * Transforms the data
   * @returns {String} The transformed data
   */
  transform() {
    return undefined;
  }
}

module.exports = {
  Transformer: Transformer,
  TransformerOption: TransformerOption
};