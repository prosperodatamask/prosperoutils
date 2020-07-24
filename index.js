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

  modules.forEach(m => {
    list[m.name] = m.description;
  });

  return list;
}

module.exports = {
  copy: copy,
  listModules: listModules,
  modules: modules,
  replace: replace
};