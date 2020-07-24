const merge = require('lodash/extend');
const forEach = require('lodash/forEach');

const copy = require('./copy');
const replace = require('./replace');

const modules = {
  [copy.name]: copy,
  [replace.name]: replace
};

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

module.exports = merge({
  listModules: listModules
}, modules);