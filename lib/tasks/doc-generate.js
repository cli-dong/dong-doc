'use strict'

var fs = require('fs')
var path = require('path')

var log = require('spm-log')
var shell = require('shelljs')

module.exports = function() {

  return function(options, next) {
    var cmd = ['jsdoc']

    fs.existsSync('index.js') && cmd.push('index.js')
    fs.existsSync('src') && cmd.push('src')
    // fs.existsSync('package.json') && cmd.push('package.json')
    fs.existsSync('README.md') && cmd.push('README.md')

    cmd.push('--configure ' + path.resolve(__dirname, '../conf.json'))
    cmd.push('--verbose')

    var r = shell.exec(cmd.join(' '), {
      silent: true
    })

    if (r.code) {
      if (r.output.indexOf('    error') === 0) {
        log.error('error', '执行 `jsdoc` 出错（' + r.output.substring(10, r.output.indexOf('\n') - 1) + '）')
      } else {
        log.error('error', '执行 `jsdoc` 出错（请检查是否已安装 `jsdoc`）')
      }
    } else {
      log.info('doc', '已生成 API 文档')
      next()
    }
  }

}
