var express = require('express');
var http = require('http');
const watch = require('node-watch');
const fs = require('fs');
const { exec } = require('child_process');
var chokidar = require('chokidar');
 
// One-liner for current directory, ignores .dotfiles
chokidar.watch('.', {ignored: /(^|[\/\\])\../}).on('all', (event, path) => {
  console.log(event, path);
});

var app = express();
var server = http.createServer(app);

app.get('/', function(req, res) {
    res.send("Hello World!");
});

server.listen(3000);
console.log('Express server started on port %s', server.address().port);


// Initialize watcher.
var watcher = chokidar.watch('testwatch.js', {
  ignored: /(^|[\/\\])\../,
  persistent: true
});

var log = console.log.bind(console);
// Add event listeners.
watcher
  .on('add', path => log(`File ${path} has been added`))
  .on('change', path => log(`File ${path} has been changed`))
  .on('unlink', path => log(`File ${path} has been removed`))
  .on('addDir', path => log(`Directory ${path} has been added`))
  .on('unlinkDir', path => log(`Directory ${path} has been removed`))
  .on('error', error => log(`Watcher error: ${error}`))
  .on('ready', () => log('Initial scan complete. Ready for changes'))
  .on('raw', (event, path, details) => {
    log('Raw event info:', event, path, details);
  })
  .on('change', (path, stats) => {
	  if (stats) console.log(`File ${path} changed size to ${stats.size}`);
   });


var watchedPaths = watcher.getWatched();

watcher.unwatch('.gitignore*');

function doGitCommand(){
	exec('git pull ', (err, stdout, stderr) => {
	  if (err) {
	    // node couldn't execute the command
	    return;
	  }

	  // the *entire* stdout and stderr (buffered)
	  console.log(`stdout: ${stdout}`);
	  console.log(`stderr: ${stderr}`);
	});

	exec('git add . ', (err, stdout, stderr) => {
	  if (err) {
	    // node couldn't execute the command
	    return;
	  }

	  // the *entire* stdout and stderr (buffered)
	  console.log(`stdout: ${stdout}`);
	  console.log(`stderr: ${stderr}`);
	});

	exec('git commit -m " ' + path + '"', (err, stdout, stderr) => {
	  if (err) {
	    // node couldn't execute the command
	    return;
	  }

	  // the *entire* stdout and stderr (buffered)
	  console.log(`stdout: ${stdout}`);
	  console.log(`stderr: ${stderr}`);
	});
}

