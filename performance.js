var config = require("./src/Config").Config("./../config.json"),
    build = require("./src/Build").Build(),
    magento = require("./src/Magento").Magento(),
    performance = require("./src/Performance").Performance(config),
    async = require("async"),
    Steps = {
        prepareEnvironment: function (callback) {
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
                                callback();
                            });
                        });
                    });
                }
            );
        },
        runJMeter: function (config, callback) {
            build.exec(config.getPerformance().getJMeter())
                .setArguments([
                    "-n",
                    "-t",
                    config.getMagentoInstanceDirectory() + "/dev/tools/performance_toolkit/benchmark.jmx",
                    "-Jhost=" + config.getMagentoUrlHost(),
                    "-Jbase_path=" + config.getMagentoUrlBase(),
                    "-Jusers=100",
                    "-Jramp_period=300",
                    "-Jreport_save_path=" + config.getMagentoInstanceDirectory() + "report/"
                ])
                .build(callback)
                .run();

        }
    };


Steps.prepareEnvironment(function () {
    Steps.runJMeter(config, function () {

    });
});
