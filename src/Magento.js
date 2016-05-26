exports.Magento = function () {

    var task = require("./Task").Task(),
        build = require("./Build").Build();

    return {
        install: function (config, callback) {
            task.start("Installing Magento into " + config.getMagentoInstanceDirectory());
            var mysqlConfig = config.getMysql(),
                installArguments = {
                    'license_agreement_accepted': 'yes',
                    'locale': 'en_US',
                    'timezone': 'America/Los_Angeles',
                    'default_currency': 'USD',
                    'db_model': "mysql4",
                    'db_host': mysqlConfig.getHost(),
                    'db_name': mysqlConfig.getName(),
                    'db_user': mysqlConfig.getUser(),
                    'db_pass': mysqlConfig.getPassword(),
                    'db_prefix': 'bamboo_',
                    'use_rewrites': 'yes',
                    'skip_url_validation': 'yes',
                    'url': config.getMagentoDefaultURL(),
                    'secure_base_url': config.getMagentoSecureURL(),
                    'use_secure': 'yes',
                    'use_secure_admin': 'yes',
                    'admin_lastname': 'Admin',
                    'admin_firstname': 'Admin',
                    'admin_email': 'admin@example.com',
                    'admin_username': 'admin',
                    'admin_password': '123123q',
                    'encryption_key': 'magicdatabasekey'
                },
                consoleArgs = ["-f", config.getMagentoInstanceDirectory() + "install.php", "--"];

            Object.keys(installArguments).forEach(function (item) {
                consoleArgs.push("--" + item);
                consoleArgs.push(installArguments[item]);
            });

            build.exec("php")
                .setArguments(consoleArgs)
                .setExecOptions({
                    cwd: config.getMagentoInstanceDirectory()
                })
                .run(function () {
                    build.exec("chmod")
                        .setArguments([
                            "0777",
                            config.getMagentoInstanceDirectory(),
                            "-R"
                        ])
                        .run(function () {
                            function _getPostInstallTasks() {
                                var tasks = [],
                                    i = 0,
                                    sql = [
                                        "REPLACE bamboo_core_config_data (scope, scope_id, path, value) VALUES" +
                                        " ('default', 0, 'admin/security/use_form_key', 0)," +
                                        " ('default', 0, 'system/csrf/use_form_key', 0);"
                                    ];

                                [
                                    'block_html',
                                    'collections',
                                    'config',
                                    'config_api',
                                    'config_api2',
                                    'eav',
                                    'full_page',
                                    'layout',
                                    'translate'
                                ].forEach(function (item) {
                                    sql.push("INSERT INTO bamboo_core_cache_option (code, value) VALUES ('" + item + "', 1);");
                                });

                                sql.forEach(function (query) {
                                    i++;
                                    tasks.push(function (callback) {
                                        build.query("use " + mysqlConfig.getName() + "; " + query, mysqlConfig, function () {
                                            callback(null, "install" + i);
                                        })
                                    });
                                });

                                return tasks;
                            }

                            require("async").parallel(_getPostInstallTasks(), function () {
                                task.end(callback)
                            })
                        });
                });
        },
        reCreateDataBase: function (config, callback) {
            var mysqlConfig = config.getMysql();
            task.start("Drop Magento database " + mysqlConfig.getHost());

            build.query("drop database if exists " + mysqlConfig.getName() + ";", mysqlConfig, function () {
                build.query("CREATE DATABASE " + mysqlConfig.getName(), mysqlConfig, function () {
                    task.end(callback);
                });
            });
        }
    }
};
