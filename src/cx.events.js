(function () {
	"use strict";

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