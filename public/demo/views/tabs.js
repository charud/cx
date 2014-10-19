(function() {
	"use strict";

	var Tabs = function() {

	};

	Tabs.prototype.init = function() {

	};

	Tabs.prototype.onSelect = function(data, e) {
		this.findArea('body').innerHTML = this.findArea(data.target).innerHTML;
	};

	cx.view('tabs', Tabs);

})();

