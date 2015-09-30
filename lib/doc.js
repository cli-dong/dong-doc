'use strict';

var log = require('spm-log')
var Queue = require('dong-queue')

module.exports = function(options) {
  var queue = new Queue()

  // 生成
  queue.use(require('./tasks/doc-generate')())

  // 监视
  // queue.use(require('./tasks/doc-watch')())

  // 发布
  // queue.use(require('./tasks/doc-publish')())

  queue.run(options, function() {
    log.info('doc', '已完成文档生成与发布')
  })
}
