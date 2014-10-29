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

	cx.plugin('ajax', {
		extend: function () {
			return {
				get: get,
				post: post
			}
		}
	});

	function get(url) {
		return request('GET', url);
	}

	function post(url, data) {
		return request('POST', url, data);
	}

	function request(method, url, data) {
		return new RSVP.Promise(function (resolve, reject) {
			var req = new XMLHttpRequest();
			req.open(method, url, true);
			req.onreadystatechange = function () {
				if (req.readyState === req.DONE) {
					if (req.status >= 400) {
						reject(req);
					} else if (req.status >= 200) {
						resolve(req.response);
					}
				}
			};
			req.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			req.send(data);
		});
	}

})();