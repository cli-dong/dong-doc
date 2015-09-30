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
  // options: [],
  bootstrap: require('./lib/doc')
}
