exports.Build = function () {
    var fs = require("fs"),
        ncp = require('ncp').ncp,
        tar = require('tar-fs'),
        zip = require("gunzip-maybe"),
        task = require("./Task").Task();

    ncp.limit = 32;

    return {
        clean: function (directory, callback) {
            task.start("Cleaning " + directory);
            // console.log();
            require("rimraf")(directory, function (err) {
                if (err) {
                    throw err;
                }
                fs.mkdir(directory);
                task.end(callback);
            });

        },
        copy: function (from, to, callback) {
            task.start("Copy " + from + " to " + to);
            ncp(from, to, function () {
                task.end(callback);
            });
        },
        mkdir: function (directory) {
            fs.mkdir(directory);
        },
        unZipTar: function (archive, to, callback) {
            task.start("Unpacking " + archive + " to " + to);
            fs.stat(archive, function (err) {
                if (err == null) {
                    var extract = tar.extract(to);
                    fs.createReadStream(archive)
                        .pipe(zip())
                        .pipe(extract);

                    extract.on('finish', function () {
                        task.end(callback);
                    });
                } else {
                    throw  "File does not exist"
                }
            });
        }
    }
};
