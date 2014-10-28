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