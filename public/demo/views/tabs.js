(function() {
	"use strict";

	var Tabs = function() {

	};

	Tabs.prototype.init = function() {

	};

	Tabs.prototype.onSelect = function(data, e) {
		this.area('body', this.area(data.target).innerHTML);
	};

	cx.view('tabs', Tabs);

})();

