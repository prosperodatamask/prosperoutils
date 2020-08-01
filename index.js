const has = require('lodash/has');
const merge = require('lodash/extend');
const forEach = require('lodash/forEach');
const semver = require('semver');

const copy = require('./copy');
const replace = require('./replace');
const salesforceid = require('./salesforce/id');

const prosperoutils = require('./package.json');

const module_list = [
  copy,
  replace,
  salesforceid
];

const modules = {};
forEach(module_list, (value) => {
  modules[value.name] = value;
});

/**
 * Returns a map of module name to description for easier listing
 * @returns {Object} A map of module name to description
 */
function listModules() {
  const list = {};

  forEach(modules, function (m) {
    list[m.name] = m.description;
  });

  return list;
}

/**
 * Dumps the config out for use in saving mappings for repeated use
 * @param {Object} field_mapping A map of field names to transformers
 * @returns {Object} The config
 */
function dumpConfig(field_mapping) {
  const config = {
    version: prosperoutils.version,
    field_config: []
  };

  forEach(field_mapping, (transformer, field) => {
    config.field_config.push({
      field_name: field,
      transformer: {
        name: transformer.name,
        config: transformer.dumpConfig()
      }
    });
  });

  return config;
}

/**
 * Loads the config to generate a field name mapping
 * @param {Object} config The prospero config data
 * @returns {Object} A mapping of field name to transformer
 */
function loadConfig(config) {
  // The transformer to use if we can't find the one listed
  const default_transformer = 'copy';
  const field_mapping = {};

  if (semver.major(config.version) !== semver.major(prosperoutils.version)) {
    throw new Error('The major version of the config does not match the Prospero Utils major version');
  }

  forEach(config.field_config, (field) => {
    let transformer_name = field.transformer.name;

    if (!has(modules, transformer_name)) {
      transformer_name = default_transformer;
    }

    field_mapping[field.field_name] = new modules[transformer_name].Transformer(field.transformer.config);
  });

  return field_mapping;
}

module.exports = merge({
  dumpConfig: dumpConfig,
  listModules: listModules,
  loadConfig: loadConfig,
  module_list: module_list
}, modules);