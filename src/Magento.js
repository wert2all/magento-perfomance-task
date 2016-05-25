exports.Magento = function () {

    var task = require("./Task").Task(),
        build = require("./Build").Build();

    function _getInstallerDirectory(config) {
        return config.getMagentoInstanceDirectory() + "/dev/tests/functional/config/";
    }

    return {
        install: function (config, callback) {
            var installDirectory = _getInstallerDirectory(config);
            task.start("Installing Magento into " + config.getMagentoInstanceDirectory());

            build.exec(
                'php',
                ['-f', installDirectory + "standalone-installer.php"],
                function () {
                    task.end(callback)
                },
                {
                    onError: function (err) {
                        throw err;
                    },
                    onOut: function (data) {
                        console.log('stdout:' + data);
                    },
                    execOption: {
                        cwd: installDirectory
                    }
                }
            );
        },
        reCreateDataBase: function (config, callback) {
            var mysqlConfig = config.getMysql();

            task.start("Drop Magento database " + mysqlConfig.getHost());
            build.exec(
                "mysql",
                [
                    "-u" + mysqlConfig.getUser(),
                    "-p" + mysqlConfig.getPassword(),
                    "-h" + mysqlConfig.getHost(),
                    "-e drop database if exists " + mysqlConfig.getName() + ";"
                ],
                function () {
                    task.end(callback)
                },
                {
                    onOut: function (data) {
                        console.log('stdout:' + data);
                    },
                    onError: function (err) {
                        throw err;
                    }
                }
            );
        },
        prepareInstall: function (config, callback) {
            task.start("Pre-Install Magento");
            var installDirectory = _getInstallerDirectory(config),
                _copyInstaller = function (magentoRepository, magentoInstallerDirectory, callback) {
                    var build = require("./Build").Build();
                    build.mkdir(magentoInstallerDirectory);
                    build.copy(
                        magentoRepository + "/dev/build/core_dev/functional/config/",
                        magentoInstallerDirectory,
                        function (err) {
                            if (err) {
                                throw err;
                            }
                            callback();
                        }
                    );
                },
                _replaceInstallScript = function (config, magentoInstallerDirectory, callback) {
                    var installScript = magentoInstallerDirectory + "install.php",
                        fs = require("fs");

                    fs.readFile(installScript, "utf8", function (err, content) {
                        if (err) {
                            throw err;
                        }

                        ([
                            {
                                from: "{{db_model}}",
                                to: "mysql4"
                            }, {
                                from: "{{db_host}}",
                                to: config.getMysql().getHost()
                            }, {
                                from: "{{db_name}}",
                                to: config.getMysql().getName()
                            }, {
                                from: "{{db_user}}",
                                to: config.getMysql().getUser()
                            }, {
                                from: "{{db_password}}",
                                to: config.getMysql().getPassword()
                            }, {
                                from: "{{url}}",
                                to: config.getMagentoDefaultURL()
                            }, {
                                from: "{{secure_url}}",
                                to: config.getMagentoSecureURL()
                            }
                        ]).forEach(function (item) {
                            content = content.replace(item.from, item.to);
                        });

                        fs.writeFile(installScript, content, function () {
                            callback();
                        })
                    });
                };

            _copyInstaller(
                config.getMagentoRepository(),
                installDirectory,
                function () {
                    _replaceInstallScript(config, installDirectory, function () {
                        task.end(callback);
                    })
                }
            );
        }
    }
};
