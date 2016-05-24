var config = require("./src/Config").Config("./../config.json"),
    build = require("./src/Build").Build(),
    magento = require("./src/Magento").Magento();


build.clean(config.getBuildDirectory(), function () {
    build.unZipTar(config.getMagentoArchive(), config.getBuildDirectory(), function () {
        magento.prepareInstall(config, function () {
            magento.install(config);
        });
    });
});
