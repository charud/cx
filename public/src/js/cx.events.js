(function () {
	"use strict";

	cx.plugin('events', {
		init: function () {

			// Move D from global namespace into the cx namepsace
			if (typeof(D) !== 'undefined' || typeof(cx.D) !== 'undefined') {
				if (typeof(cx.D) === 'undefined') {
					cx.D = D;
					delete(window.D);
				}
			} else {
				throw "D.js is required for cx.events";
			}

		},

		extend: function () {
			return {
				onEvent: onEvent,
				emitEvent: emitEvent
			}
		}
	});

	function onEvent(elm, name) {
		var d = D();
		elm.addEventListener(name, function (e) {
			d.resolve(e);
		});
		return d;
	}

	function emitEvent(elm, name, params) {
		elm.dispatchEvent(new CustomEvent(name, params));
	}

})();