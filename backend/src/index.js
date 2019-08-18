// Enable module aliases
// @see https://www.npmjs.com/package/module-alias
require('module-alias/register');

// "esm is the world’s most advanced ECMAScript module loader."
// @see https://www.npmjs.com/package/esm
require('esm');

module.exports = require('./index.post-esm.js');