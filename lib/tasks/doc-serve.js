'use strict'

var http = require('http')
var path = require('path')

var finalhandler = require('finalhandler')
var log = require('spm-log')
var morgan = require('morgan')
var open = require('open')
var Queue = require('dong-queue')

module.exports = function() {

  return function(options, next) {

    if (!options.serve) {
      return next()
    }

    var queue = new Queue()

    if (options.debug) {
      queue.use(morgan('tiny'))
    }

    var GH_PAGES_PATH = options.GH_PAGES_PATH

    queue.use([

      require('serve-favicon')(path.resolve(__dirname, '../assets/favicon.png')),

      require('serve-static')(GH_PAGES_PATH),

      require('serve-index')(GH_PAGES_PATH, {
        'icons': true
      })

    ])

    // Create server
    var server = http.createServer(function(req, res) {

      function logError(err) {
        console.error(err.stack || err.toString())
      }

      queue.run(req, res, function() {
        finalhandler(req, res, {
          onerror: logError
        })()
      })

    })

    // Listen
    server.listen(options.port, function() {
      log.info('serve', '░▒▓██ Listening at port "%s" ...', options.port)

      if (options.open) {
        open('http://127.0.0.1:' + options.port)
      }
    })

    next()
  }

}
