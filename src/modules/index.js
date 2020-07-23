const cloneDeep = require('lodash/cloneDeep');
const has = require('lodash/has');

/**
 * Options for the transformer
 */
class TransformerOption {
  #name;
  #description;
  #opt_type;
  value;

  /**
   * The constructor
   * @param {String} name The name of the option
   * @param {String} description A description for the option
   * @param {String} opt_type The type of the option
   * @param {Object} default_value The default value
   */
  constructor(name, description, opt_type, default_value) {
    this.#name = name;
    this.#description = description;
    this.#opt_type = opt_type;

    if (default_value) {
      this.value = default_value;
    }
  }

  /**
   * Gets the name of transformer
   */
  get name() {
    return this.#name;
  }

  /**
   * Gets the description
   */
  get description() {
    return this.#description;
  }

  /**
   * Gets the type
   */
  get type() {
    return this.#opt_type;
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