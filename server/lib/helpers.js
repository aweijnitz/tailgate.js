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
        if (err)
            cb(err, null);
        else {
            var files = [];
            dirContent.map(function (file) {
                var fullPath = path.join(absPath, file);
                if (fs.statSync(fullPath).isFile())
                    files.push(fullPath);
            });
            cb(null, files);
        }
    });
};


/**
 * Read a chunk from a file.
 *
 * @param start - Start offset.
 * @param end - End offset.
 * @param cb - callback function. cb(err, content)
 */
var readFileChunk = function readFileChunk(filePath, start, end, cb) {
    if (end <= start) {
        cb(null, '');
        return;
    }

    var fileStream = fs.createReadStream(filePath, {start: start, end: end});

    fileStream.on('data', function (data) {
        cb(null, data);
    });

    fileStream.on('error', function (err) {
        cb(err, null);
    });
};

exports = module.exports.readFilesInDir = readFilesInDir;
exports = module.exports.readFileChunk = readFileChunk;