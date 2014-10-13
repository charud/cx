(function () {
    "use strict";

    var plugins = [];

    function cx() {
        cx.init(plugins);
    }

    cx.plugin = function (name, plugin) {
        plugins.push(plugin);
    };

    cx.info = function () {
        console.group('cx: info');
        console.info("cx: loaded plugins:", plugins);
        plugins.forEach(function (plugin) {
            if (plugin['info']) {
                plugin.info();
            }
        });
        console.groupEnd();
    };

    cx.init = function (plugins) {
        plugins.forEach(function (plugin) {
            if (plugin['init']) {
                plugin.init();
            }
        });
    };

    window.cx = cx;
})();

// console shim @ http://stackoverflow.com/questions/8785624/how-to-safely-wrap-console-log
(function () {
    var f = function () {
    };
    if (!window.console) {
        window.console = {
            log: f, info: f, warn: f, debug: f, error: f, group: f, groupEnd: f
        };
    }
}());