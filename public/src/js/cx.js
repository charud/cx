(function () {
    "use strict";

    var plugins = {};

    function cx() {
        cx.init(plugins);
    }

    cx.plugin = function(name, plugin) {
        plugins[name] = plugin;
    };

    cx.info = function() {
        console.group('cx: info');
        console.info("cx: loaded plugins:", plugins);
        for (var i in plugins) {
            if (plugins.hasOwnProperty(i)) {
                var plugin = plugins[i];
                if(plugin['info']) {
                    plugin.info();
                }
            }
        }
        console.groupEnd();
    };

    cx.init = function (plugins) {
        for (var i in plugins) {
            if(plugins.hasOwnProperty(i)) {
                var plugin = plugins[i];
                if (plugin['init']) {
                    plugin.init();
                }
            }
        }
    };

    window.cx = cx;
})();

// console shim @ http://stackoverflow.com/questions/8785624/how-to-safely-wrap-console-log
(function () {
    var f = function () {};
    if (!window.console) {
        window.console = {
            log:f, info:f, warn:f, debug:f, error:f, group:f, groupEnd:f
        };
    }
}());