'use strict';

var FileSizeWatcher_Redux = require('..\\src\\FileSizeWatcher_Redux');
var exec = require('child_process').exec;

describe('FileSizeWatcher_Redux',
  function(){

    var watcher;

    afterEach(
      function(){
        watcher.stop();
    });

    it('should fire a "grew" event when the file grew in size', 
      function(done){

        var path = '..\\FileSizeWatcher_Redux.test';

        exec('rm -force ' + path + ' ; echo "test" > ' + path,
          function(){

            watcher = new FileSizeWatcher_Redux(path);

            watcher.on('grew',
              function(gain){
                expect(gain).toBe(9);
                done();
            });

            exec('echo "test" > ' + path,
              function(){
            });
        });
    });

    it('should fire a "shrank" event when the file shrank in size',
      function(done){

        var path = '..\\FileSizeWatcher_Redux.test';

        // Recreate the file as empty
        exec('rm -force ' + path + ' ; touch ' + path,
          function(){

            watcher = new FileSizeWatcher_Redux(path);

            watcher.on('shrank',
              function(loss){

                expect(loss).toBe(3);
                done();
            });

            exec('echo "a" > ' + path,
              function(){
            });
        });
    });


    it('should fire "error" if path is not of extension ".test".',
      function(done) {
        var path = '..\\FileSizeWatcher_Redux.tes';

        watcher = new FileSizeWatcher_Redux(path);

        watcher.on('error',
          function(err){
            expect(err).toBe('Path is not of extenstion ".test".');
            done();
        });
    });
});