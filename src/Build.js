exports.Build = function () {
    var fs = require("fs"),
        ncp = require('ncp').ncp,
        tar = require('tar-fs'),
        zip = require("gunzip-maybe"),
        task = require("./Task").Task();

    ncp.limit = 32;

    function defaultError(err) {
        throw err;
    }

    return {
        clean: function (directory, callback) {
            task.start("Cleaning " + directory);
            // console.log();
            require("rimraf")(directory, function (err) {
                if (err) {
                    defaultError(err);
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
        exec: function (command) {
            var _opt = {
                    onOut: function (data) {
                        console.log('stdout:' + data);
                    },
                    onError: defaultError,
                    execOption: {}
                },
                args = [];
            return {
                build: function (callback) {
                    return {
                        run: function () {
                            var exec = require('child_process').spawn(command, args, _opt.execOption);
                            exec.stdout.on('data', _opt.onOut);
                            exec.stderr.on('data', _opt.onError);
                            exec.on('close', callback);
                        }
                    }
                },
                setExecOptions: function (options) {
                    _opt.execOption = options;
                    return this;
                },
                setOnOut: function (func) {
                    _opt.onOut = func;
                    return this;
                },
                setOnError: function (func) {
                    _opt.onError = func;
                    return this;
                },
                setArguments: function (arguments) {
                    args = arguments;
                    return this;
                }
            }
        }
    }
};
