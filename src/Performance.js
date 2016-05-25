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
                    console.log(profile);
                    task.end()
                }
            );
        }
    }
};
