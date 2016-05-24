exports.Task = function () {
    function _testCallback(callback) {
        return ( !( typeof callback == "function" ) ) ? function () {
        } : callback;
    }

    return {
        start: function (message) {
            process.stdout.write(message + " ... ");
        },
        end: function (callback) {
            console.log("done!");
            _testCallback(callback)();
        }
    }
};
