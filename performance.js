var config = require("./src/Config").Config("./../config.json"),
    build = require("./src/Build").Build(),
    magento = require("./src/Magento").Magento();


build.clean(config.getBuildDirectory(), function () {
    build.copy(config.getMagentoRepository(), config.getMagentoInstanceDirectory(),
        function (err) {
            magento.install(config);
        })
});
