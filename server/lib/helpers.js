var fs = require('fs');
var path = require('path');

/**
 * Filers for files in a folder and passes an array of absoulte file paths to the callback
 * @param dir - Folder to scan fr files
 * @param cb - callback function. cb(err, filePathsArray)
 */
var readFilesInDir = function readFilesInDir(dir, cb) {
    var absPath = path.resolve(dir);
    fs.readdir(absPath, function dirHandler(err, dirContent) {
        if(err)
            cb(err, null);
        else {
            var files = [];
            dirContent.map(function(file) {
                var fullPath = path.join(absPath,file);
                if(fs.statSync(fullPath).isFile())
                    files.push(fullPath);
            });
            cb(null, files);
        }
    });
};

exports = module.exports.readFilesInDir = readFilesInDir;