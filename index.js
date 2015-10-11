/*
 * dong-doc
 * https://github.com/crossjs/dong-doc
 *
 * Copyright (c) 2015 crossjs
 * Licensed under the MIT license.
 */

'use strict';

module.exports = {
  command: 'doc',
  description: '生成 API 文档',
  options: [{
    name: 'watch',
    alias: 'w',
    description: '监视目录变化',
    defaults: false
  }, {
    name: 'serve',
    alias: 's',
    description: '启动 Web 服务',
    defaults: false
  }, {
    name: 'port',
    alias: 'p',
    description: 'Web 服务端口',
    defaults: 9528
  }, {
    name: 'open',
    alias: 'o',
    description: 'Web 服务端口',
    defaults: false
  }, {
    name: 'release',
    alias: 'r',
    description: '发布到 gh-pages',
    defaults: false
  }, {
    name: 'debug',
    alias: 'd',
    description: '显示调试信息',
    defaults: false
  }],
  bootstrap: require('./lib/doc')
}
