'use strict';

var fs = require('fs');

var FileSizeWatcher = function(path){

  var self = this;
  self.callbacks = {};

  if(/^.+\.test/.test(path) === false) {
    process.nextTick(function(){
      self.callbacks['error']('Path is not of extenstion ".test".');
    });

    return;
  }

  fs.stat(path,
    function(err, stats){
      self.lastFileSize = stats.size;
  });

  self.interval = setInterval(
    function(){
      fs.stat(path, function(err, stats){

        if(stats.size < self.lastFileSize){
          self.callbacks['shrank'](self.lastFileSize - stats.size);
          self.lastFileSize = stats.size;
        }

        if(stats.size > self.lastFileSize){
          self.callbacks['grew'](stats.size - self.lastFileSize);
          self.lastFileSize = stats.size;
        }
    });
  }, 1000);
    
};

FileSizeWatcher.prototype.on = function(eventType, callback) {
  this.callbacks[eventType] = callback;
};

FileSizeWatcher.prototype.stop = function(){
  clearInterval(this.interval);
};

module.exports = FileSizeWatcher;