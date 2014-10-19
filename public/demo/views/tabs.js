(function() {
	"use strict";

	var Tabs = function() {

	};

	Tabs.prototype.onSelect = function() {
		console.log("tab selected");
	};

	cx.view('tabs', Tabs);

})();