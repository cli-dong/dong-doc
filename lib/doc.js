"use strict";

var fs = require('fs');
var path = require('path');

var log = require('spm-log');
var glob = require('glob-all');

module.exports = function (options, sources) {
  var
    binPath = __dirname + '/../node_modules/.bin/jsdoc',
    logPrefix = 'doc';

  binPath = path.resolve(binPath);

  if (!(fs.existsSync(binPath) && fs.statSync(binPath).isFile() === true)) {
    log.error(logPrefix, 'no JSDoc found.');
    return;
  }

  if (sources.length === 0) {
    log.error(logPrefix, 'There are no input files to process. Set it in ./package.json -> dong.doc.src');
    return;
  }

  binPath = path.relative('.', binPath);

  var
    isWin = process.platform === 'win32',
    cmd = (isWin) ? 'cmd' : binPath,
    args = (isWin) ? ['/c', binPath] : [],
    spawn = require('child_process').spawn;

  for (var optionName in options) {
    if (options.hasOwnProperty(optionName)) {
      var option = options[optionName];
      if (option === true || typeof option === 'string') {
        args.push('--' + optionName);
      }
      if (typeof option === 'string') {
        args.push(option);
      }
    }
  }

  args.push.apply(args, glob.sync(sources));

  // handle paths that contain spaces
  if (isWin) {
    // Windows: quote paths that have spaces
    args = args.map(function (item) {
      return item.indexOf(' ') >= 0 ? '"' + item + '"' : item;
    });
  } else {
    // Unix: escape spaces in paths
    args = args.map(function (item) {
      return item.replace(' ', '\\ ');
    });
  }

  //log.info(logPrefix, "Running : "+ cmd + " " + args.join(' '));

  var child = spawn(cmd, args, {
    windowsVerbatimArguments: isWin
  });

  log.info(logPrefix, 'JSDoc is running, Please wait...');

  child.stdout.on('data', function (data) {
    log.info(logPrefix, data.toString());
  });
  child.stderr.on('data', function (data) {
    log.error(logPrefix, data.toString());
  });
  child.on('exit', function (code) {
    code === 0
      ? log.info(logPrefix, 'Documentation generated successfully.')
      : log.error(logPrefix, 'JSDoc terminated with a non-zero exit code: ' + code);
  });
};
