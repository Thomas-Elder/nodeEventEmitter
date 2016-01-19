/**
 * FileSizeWatcher_Redux.js
 * 
 * A slightly different implementation of the FileSizeWatcher module, where we
 * inherit the emit event functionality from events.EventEmitter.
 *
 * This is done by using a util function 'inherits'.
 */

'use strict';

var fs = require('fs');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var FileSizeWatcher_Redux = function(path){
  var self = this;

  // Error if file has incorrect extension.
  if(/^.+\.test/.test(path) === false) {
    process.nextTick(function(){
      self.emit('error', 'Path is not of extenstion ".test".');
    });

    return;
  }

  // Get initial size of the file.
  fs.stat(path,
    function(err, stats){
      self.lastFileSize = stats.size;
  });

  // Every second check the size of the file, call an appropriate callback
  // function if there's a change.
  self.interval = setInterval(
    function(){
      fs.stat(path, function(err, stats){

        if(stats.size < self.lastFileSize){
          self.emit('shrank', self.lastFileSize - stats.size);
          self.lastFileSize = stats.size;
        }

        if(stats.size > self.lastFileSize){
          self.emit('grew', stats.size - self.lastFileSize);
          self.lastFileSize = stats.size;
        }
    });
  }, 1000);

};

//
util.inherits(FileSizeWatcher_Redux, EventEmitter);

// Stop watching the file.
FileSizeWatcher_Redux.prototype.stop = function(){
  clearInterval(this.interval);
};

module.exports = FileSizeWatcher_Redux;