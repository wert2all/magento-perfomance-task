exports.Build = function () {
    var fs = require("fs"),
        ncp = require('ncp').ncp;

    ncp.limit = 16;

    return {
        clean: function (directory, callback) {
            process.stdout.write("Cleaning " + directory + "... ");
            // console.log();
            require("rimraf")(directory, function (err) {
                if (err) {
                    throw err;
                }
                fs.mkdir(directory);
                console.log("done!");
                if (callback && typeof callback) {
                    callback();
                }
            });

        },
        mkdir: function (directory) {

        },
        copy: function (from, to, callback) {
            process.stdout.write("Copy " + from + " to " + to + " ... ");
            ncp(from, to, function () {
                console.log("done!");
                if (typeof  callback == "function") {
                    callback();
                }
            });
        }
    }
};
