'use strict'

var fs = require('fs')

var log = require('spm-log')
var shell = require('shelljs')
var Queue = require('dong-queue')

module.exports = function() {

  return function(options, next) {

    if (!options.release) {
      return next()
    }

    var GH_PAGES_PATH = options.GH_PAGES_PATH

    if (!fs.existsSync(GH_PAGES_PATH)) {
      log.error('path', GH_PAGES_PATH + ' doesn\'t exists')
      return next()
    }

    // `git add *` to make sure we catch untracked files
    // `git add -u` to make sure we remove deleted files
    // `git commit -m {commitMsg}`

    var switchCwd = ['cd', GH_PAGES_PATH]

    var gitAddAll = ['git', 'add', '*']
    var gitAddDel = ['git', 'add', '-u']
    var gitCommit = ['git', 'commit', '-m', 'update']
    var gitPush = ['git', 'push', 'origin', 'gh-pages']

    var queue = new Queue()

    queue.use([gitAddAll, gitAddDel, gitCommit, gitPush].map(function(cmd) {
      return function(next) {
        cmd = [switchCwd.join(' '), cmd.join(' ')].join('&&')

        var r = shell.exec(cmd, {
          silent: !options.debug
        })

        if (r.code) {
          log.error('git', r.output)
        } else {
          next()
        }
      }
    }))

    queue.run(function() {
      log.info('gh-pages', 'published!')
      next()
    })

  }

}
