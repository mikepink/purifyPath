/** purifyPath.js - Cleanse a path of cover art and DS Store **/

var exec = require('child_process').exec;
var fs = require('fs');

function destroyDir(path) {
  // TODO: make this work in Windows.
  exec('rm -r ' + path);
  console.log('Deleted ', path);
}

function destroyFile(path) {
  fs.unlink(path, function(err) {
    if (err) throw err;

    console.log('Deleted ', path);
  });
  
}

function formPath(path, file) {
  return path + '/' + file;
}

function identifyFile(path, file, err, stats) {
  if (err) throw err;

  if (stats.isDirectory()) {
    processPath(path, file);
  } else if (stats.isFile()) {
    processFile(path, file);
  }

}

function processFile(path, file) {
  // TODO: allow custom file extensions.
  if (file[0] === '.' || file.slice(-4) !== '.mp3') {
    destroyFile(formPath(path, file));
    return;
  }
}

function processPath(path, dirName) {
  var formedPath = dirName ? formPath(path, dirName) : path;
  if (dirName[0] === '.') {
    destroyDir(formedPath);
    return;
  }

  fs.readdir(formedPath, function(err, files) {
    if (err) throw err;

    files.forEach(function(file) {
      fs.stat(formPath(formedPath, file), identifyFile.bind(this, formedPath, file));
    });
  });
}

function purifyPath(pathToPurify) {
  fs.stat(pathToPurify, function(err, stats) {
    if (err) throw err;

    if (!stats.isDirectory()) {
      throw new Error('You must specify a directory to purify.')
    }

    processPath(pathToPurify, '');
  });
}

module.exports = purifyPath;