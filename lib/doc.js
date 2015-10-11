'use strict';

var path = require('path')

var Queue = require('dong-queue')

module.exports = function(options) {
  var queue = new Queue()

  // 生成
  queue.use(require('./tasks/doc-jsdoc')())

  // 发布
  queue.use(require('./tasks/doc-release')())

  // Web 服务
  queue.use(require('./tasks/doc-serve')())

  options.GH_PAGES_PATH = path.resolve(process.cwd(), '../.' + options.pkg.name + '-gh-pages/')

  queue.run(options)
}
