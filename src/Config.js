exports.Config = function (path) {
    var buildConfig = require(path);
    testConfig(buildConfig);

    function testConfig(buildConfig) {

    }

    return {
        getBuildDirectory: function () {
            return buildConfig.directory.build;
        },
        getMagentoInstanceDirectory: function () {
            return buildConfig.directory.build + "/magento/";
        },
        getMagentoRepository: function () {
            return buildConfig.directory.magento
        },
        getMagentoArchive: function () {
            return buildConfig.files.magento_archive
        },
        getMysql: function () {

            return (function () {
                var mysql = buildConfig.mysql;
                return {
                    getHost: function () {
                        return mysql.host;
                    },
                    getName: function () {
                        return mysql.name;
                    },
                    getUser: function () {
                        return mysql.user;
                    },
                    getPassword: function () {
                        return mysql.password;
                    }
                }
            })();
        }
    }
};
