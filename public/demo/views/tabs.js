(function() {
	"use strict";

	var Tabs = function() {

	};

	Tabs.prototype.onSelect = function(data, e) {
		this.findArea('body').innerHTML = this.findArea(data.name).innerHTML;
	};

	cx.view('tabs', Tabs);

})();