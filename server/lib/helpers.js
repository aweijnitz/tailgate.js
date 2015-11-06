var fs = require('fs');
var path = require('path');

/**
 * Filers for files in a folder and passes an array of absoulte file paths to the callback
 * @param dir - Folder to scan fr files
 * @param cb - callback function. cb(err, filePathsArray)
 */
var listFiles = function listFiles(dir, cb) {
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
 * Check that a given path exists and is a file.
 * @param fileName
 * @returns {boolean}
 */
var exists = function exists(fileName) {
    try {
        var s = fs.statSync(fileName);
        return s.isFile();
    } catch (err) {
        return false;
    }
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

/**
 *
 * @param useConsole
 * @returns {{debug, info, warn, error}}
 */
var mockLogger = function (useConsole) {
    var printLog = false;
    if (!(typeof useConsole === 'undefined') && useConsole) printLog = true;

    var makeLogger = function (level) {
        return function (msg) {
            if (printLog)
                console.log(level + " - " + msg);
        };
    };

    return {
        debug: makeLogger('DEBUG'),
        info: makeLogger('INFO'),
        warn: makeLogger('WARN'),
        error: makeLogger('ERROR')
    };
};

exports = module.exports.listFiles = listFiles;
exports = module.exports.exists = exists;
exports = module.exports.readFileChunk = readFileChunk;
exports = module.exports.mockLogger = mockLogger;