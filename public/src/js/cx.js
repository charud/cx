(function () {
    "use strict";

    var plugins = [];

    function cx() {
        init(plugins);
    }

    function init(plugins) {
        // Iniitalize events
		plugins.forEach(function (plugin) {
            if (plugin['init']) {
                plugin.init();
            }
        });
    }

    function registerPlugin(name, plugin) {
        plugin.name = name;
        plugins.push(plugin);

        // extend the cx function with possible extensions from the plugin
        if(plugin.extend) {
            var extensions = plugin.extend();
            for(var key in extensions) {
                if(extensions.hasOwnProperty(key) && typeof cx[key] === 'undefined') {
                    cx[key] = extensions[key];
                }
            }
        }
    }

    function logInfo() {
        console.group('cx info');
        console.info("loaded plugins:");
        console.dir(plugins);
        plugins.forEach(function (plugin) {
            if (plugin['info']) {
                plugin.info();
            }
        });
        console.groupEnd();
    }

    window.cx = cx;
    cx.plugin = registerPlugin;
    cx.info = logInfo;
})();

// console shim
// http://stackoverflow.com/questions/8785624/how-to-safely-wrap-console-log
(function () {
    var f = function () {
    };
    if (!window.console) {
        window.console = {
            log: f, info: f, warn: f, debug: f, error: f, group: f, groupEnd: f, dir: f
        };
    }
}());