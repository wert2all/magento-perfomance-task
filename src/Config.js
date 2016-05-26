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
        getMagentoDefaultURL: function () {
            return "http://" + this.getMagentoUrlBase() + this.getMagentoUrlBase();
        },
        getMagentoUrlHost: function () {
            return buildConfig.url.host
        },
        getMagentoUrlBase: function () {
            return buildConfig.url.base
        },
        getMagentoSecureURL: function () {
            return buildConfig.url.secure
        },
        getPerformanceDirectory: function () {
            return buildConfig.directory.performance;
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
        },
        getPerformance: function () {
            var performance = buildConfig.performance;
            return {
                getVersion: function () {
                    return performance.version;
                },
                getProfile: function () {
                    return performance.profile;
                },
                getJMeter: function () {
                    return performance.jmeter;
                }
            }
        }
    }
};
