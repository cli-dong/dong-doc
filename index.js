'use strict';

var path = require('path');

var extend = require('extend');
var getPkg = require('package');

module.exports = function (options) {

  var
    pkg = getPkg('.'),
    dong = pkg && pkg.dong,
    sources = dong && dong.doc && dong.doc.src || [];

  // set default jsdoc options
  options = extend({
    configure: path.resolve(__dirname + '/jsdoc.conf.json'),
    verbose: true // Log detailed information to the console as JSDoc runs.
  }, options || {}, dong && dong.doc && dong.doc.options || {});

  require('./lib/doc')(options, sources);
};
