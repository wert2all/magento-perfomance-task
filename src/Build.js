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
        },
        exec: function (command, args, callback, options) {
            var spawn = require('child_process').spawn,
                _opt = {
                    onOut: function (data) {
                    },
                    onError: function (err) {
                    },
                    execOption: {}
                };

            if (typeof options.onOut == "function") {
                _opt.onOut = options.onOut;
            }
            if (typeof options.onError == "function") {
                _opt.onError = options.onError;
            }
            if (typeof options.execOption != "undefined") {
                _opt.execOption = options.execOption;
            }
            var exec = spawn(command, args, _opt.execOption);
            exec.stdout.on('data', _opt.onOut);
            exec.stderr.on('data', _opt.onError);
            exec.on('close', callback);
        }
    }
};
