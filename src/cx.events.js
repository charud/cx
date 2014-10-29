(function () {
	"use strict";

	window.cx = window.cx || {};

	// this code is used when this plugin is loaded before the cx.js main file is loaded
	if (typeof(cx) === 'undefined' || !cx.plugin) {
		cx.pluginsToLoad = cx.pluginsToLoad || {};
		cx.plugin = function (name, plugin) {
			cx.pluginsToLoad[name] = plugin;
		}
	}

	cx.plugin('events', {
		init: function () {

		},

		extend: function () {
			return {
				onEvent: onEvent,
				emitEvent: emitEvent
			}
		}
	});

	function onEvent(elm, name, callback) {
		elm.addEventListener(name, callback);
	}

	function emitEvent(elm, name, params) {
		elm.dispatchEvent(new CustomEvent(name, params));
	}

})();