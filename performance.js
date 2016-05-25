var config = require("./src/Config").Config("./../config.json"),
    build = require("./src/Build").Build(),
    magento = require("./src/Magento").Magento(),
    performance = require("./src/Performance").Performance(config),
    async = require("async");


async.parallel([
        function (callback) {
            magento.reCreateDataBase(config, function () {
                callback(null, "dropDatabase");
            });
        },
        function (callback) {
            build.clean(config.getBuildDirectory(), function () {
                build.unZipTar(config.getMagentoArchive(), config.getBuildDirectory(), function () {
                    callback(null, "unpack");
                });
            });
        }
    ],
    function () {
        magento.prepareInstall(config, function () {
            magento.install(config, function () {
                performance.init(config.getPerformance().getProfile(), function () {
                    
                });
            });
        });
    }
);



