exports.Magento = function () {
    function _replaceInstallScript(Config) {
        // console.log(Config)
    }

    return {
        install: function (Config) {
            process.stdout.write("Installing Magento into " + Config.getMagentoInstanceDirectory() + " ... ");
            _replaceInstallScript(Config);
            console.log("done!");
        }
    }
};
