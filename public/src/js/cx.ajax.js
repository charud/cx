(function () {
	"use strict";

	cx.plugin('ajax', {
		extend: function () {
			return {
				get: get,
				post: post
			}
		}
	});

	function get(url) {
		return new RSVP.Promise(function (resolve, reject) {
			var req = new XMLHttpRequest();
			req.open('GET', url, true);
			req.onreadystatechange = function () {
				if (req.readyState === 4) {
					if (req.status >= 400) {
						reject(req);
					} else if (req.status >= 200) {
						resolve(req);
					}
				}
			};
			req.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			req.send();
		});
	}

	function post(url, data) {
		return new RSVP.Promise(function (resolve, reject) {
			var req = new XMLHttpRequest();
			req.open('POST', url, true);
			req.onreadystatechange = function () {
				if (req.status >= 400) {
					reject(req);
				} else if (req.status >= 200) {
					resolve(req);
				}
			};
			req.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			req.send(data);
		});
	}

})();