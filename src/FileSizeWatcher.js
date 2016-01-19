//
// ##FileSizeWatcher.js
//
// A nodejs module which watches a given file and emits events when the file
// size changes.
//
// Events:
// * 'error'
// * 'grew'
// * 'shrank'
//

'use strict';

var fs = require('fs');

var FileSizeWatcher = function(path){

  // Create self reference so we can refer to this 'this', in other objects.
  var self = this;

  self.callbacks = {};

  // Error if file has incorrect extension.
  if(/^.+\.test/.test(path) === false) {
    process.nextTick(function(){
      self.callbacks.error('Path is not of extenstion ".test".');
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
          self.callbacks.shrank(self.lastFileSize - stats.size);
          self.lastFileSize = stats.size;
        }

        if(stats.size > self.lastFileSize){
          self.callbacks.grew(stats.size - self.lastFileSize);
          self.lastFileSize = stats.size;
        }
    });
  }, 1000);
    
};

// Register a callback function with the watcher.
FileSizeWatcher.prototype.on = function(eventType, callback) {
  this.callbacks[eventType] = callback;
};

// Stop watching the file.
FileSizeWatcher.prototype.stop = function(){
  clearInterval(this.interval);
};

module.exports = FileSizeWatcher;