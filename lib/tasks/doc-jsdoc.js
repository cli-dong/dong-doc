'use strict'

var fs = require('fs')
var path = require('path')

var log = require('spm-log')
var Queue = require('dong-queue')
var rimraf = require('rimraf')
var shell = require('shelljs')
var watch = require('watch')

module.exports = function() {

  return function(options, next) {

    var GH_PAGES_PATH = options.GH_PAGES_PATH;

    function g(watched) {
      var cmd = [path.resolve(__dirname, '../../node_modules/.bin/jsdoc')]

      fs.existsSync('index.js') && cmd.push('index.js')
      fs.existsSync('src') && cmd.push('src')
        // fs.existsSync('package.json') && cmd.push('package.json')
      fs.existsSync('README.md') && cmd.push('README.md')

      cmd.push('--configure ' + path.resolve(__dirname, '../assets/conf.json'))
      // cmd.push('--template ' + path.resolve(__dirname, '../assets/minami'))
      cmd.push('--destination ' + GH_PAGES_PATH)
      cmd.push('--verbose')

      if (watched) {
        log.info('jsdoc', 're-generating...')
      }

      var r = shell.exec(cmd.join(' '), {
        silent: !options.debug
      })

      if (r.code) {
        log.error('jsdoc', r.output)
        return false
      } else {
        if (watched) {
          log.info('jsdoc', 're-generated!')
        } else {
          log.info('jsdoc', 'generated!')
        }
      }
      return true
    }

    // watching files
    if (options.watch) {
      watch.createMonitor(process.cwd(), function(monitor) {
        log.info('watch', 'Watching for modification...')
        monitor.on('created', function() {
          g(true)
        })
        monitor.on('changed', function() {
          g(true)
        })
        monitor.on('removed', function() {
          g(true)
        })
      })
    }

    var queue = new Queue()

    if (fs.existsSync(GH_PAGES_PATH)) {

      fs.readdirSync(GH_PAGES_PATH).forEach(function(dir) {
        if (dir !== '.git') {
          queue.use(function(next) {
            rimraf(path.join(GH_PAGES_PATH, dir), function(err) {
              if (err) {
                log.warn('clean', err);
              }

              next()
            })
          })
        }
      })

    } else {

      var switchCwd = ['cd', path.resolve(process.cwd(), GH_PAGES_PATH)]

      var gitClone = ['git', 'clone', options.pkg.homepage || options.pkg.repository.url, GH_PAGES_PATH]
      var gitCheckout = ['git', 'checkout', '-b', 'gh-pages']
      var gitPull = ['git', 'pull', 'origin', 'gh-pages']

      queue.use([gitClone, gitCheckout, gitPull].map(function(cmd, index) {
        return function(next) {
          cmd = cmd.join(' ')

          if (index) {
            cmd = [switchCwd.join(' '), cmd].join('&&')
          }

          var r = shell.exec(cmd, {
            silent: !options.debug
          })

          if (index !== 2 && r.code) {
            log.error('git', r.output)
          } else {
            next()
          }
        }
      }))

    }

    queue.use(function(next) {
      g() && next()
    })

    queue.run(next)

  }

}
