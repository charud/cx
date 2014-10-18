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
				event: {
					onEvent: onEvent,
					emitEvent: emitEvent
				}
			}
		}
	});

	function onEvent(elm, name) {
		var d = D();

	}

	function emitEvent() {

	}

})();