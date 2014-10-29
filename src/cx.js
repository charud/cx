(function () {
	"use strict";

	window.cx = window.cx || {};

	var plugins = [];

	var _cx = function() {
		init(plugins);
	};

	var init = function(plugins) {
		plugins.forEach(function (plugin) {
			if (plugin['init']) {
				plugin.init();
			}
		});
	};

	var registerPlugin = function(name, plugin) {
		plugin.name = name;
		plugins.push(plugin);

		// extend the cx function with possible extensions from the plugin
		if (plugin.extend) {
			var extensions = plugin.extend();
			for (var key in extensions) {
				if (extensions.hasOwnProperty(key) && typeof cx[key] === 'undefined') {
					cx[key] = extensions[key];
				}
			}
		}
	};

	var logInfo = function() {
		console.group('cx info');
		console.info("loaded plugins:");
		console.dir(plugins);
		plugins.forEach(function (plugin) {
			if (plugin['info']) {
				plugin.info();
			}
		});
		console.groupEnd();
	};

	// register plugins that has been loaded before this file was loaded
	if (cx.pluginsToLoad) {
		for (var name in cx.pluginsToLoad) {
			registerPlugin(name, cx.pluginsToLoad[name]);
		}
	}

	window.cx = _cx;
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