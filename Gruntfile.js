module.exports = function (grunt) {

    (function () {
        grunt.task.loadNpmTasks("grunt-contrib-clean");
        grunt.task.loadNpmTasks('grunt-mkdir');
        grunt.task.loadNpmTasks('grunt-contrib-copy');
    })();


    var buildConfig = grunt.file.readJSON("config.json"),
        Build = {
            clean: function (directory) {
                grunt.config.set("clean", {
                    options: {
                        force: true
                    },
                    tmp: directory
                });
                grunt.task.run("clean");
                this.mkdir(directory);
            },
            mkdir: function (directory) {
                grunt.config.set("mkdir", {
                    tmp: {
                        options: {
                            create: [directory]
                        }
                    }
                });
                grunt.task.run("mkdir");
            },
            copy: function (from, to) {
                grunt.config.set("copy", {
                    tmp: {
                        expand: true,
                        cwd: from,
                        src: "**",
                        dest: to
                    }
                });
                grunt.task.run("copy");
            }
        },
        Magento = {};

    grunt.registerTask("default", function () {
        var magento_build_path = buildConfig.directory.build + "/magento";

        Build.clean(buildConfig.directory.build);
        Build.copy(buildConfig.directory.magento, magento_build_path)
    });


};
