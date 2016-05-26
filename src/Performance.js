exports.Performance = function (config) {
    var task = require("./Task").Task(),
        build = require("./Build").Build();
    return {
        init: function (profile, callback) {
            task.start("Init performance-toolkit");
            var localDirectory = config.getMagentoInstanceDirectory() + "/dev/tools/performance_toolkit/";
            build.mkdir(config.getMagentoInstanceDirectory() + "/dev/tools/");
            build.mkdir(localDirectory);
            build.copy(
                config.getPerformanceDirectory() + config.getPerformance().getVersion(),
                localDirectory,
                function () {
                    build.exec('php')
                        .setArguments(['-f', localDirectory + "generate.php", "--", "--profile=profiles/" + config.getPerformance().getProfile() + ".xml"])
                        .setExecOptions({
                            cwd: localDirectory
                        })
                        .build(function () {
                            build.mkdir(config.getMagentoInstanceDirectory() + "report/");
                            task.end(callback)
                        })
                        .run();
                }
            );
        }
    }
};
