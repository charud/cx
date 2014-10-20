(function () {
	"use strict";

	var Tabs = function () {

	};

	Tabs.prototype.init = function (data) {
		if (data.show) {
			this.showTab(data.show);
		}
	};

	Tabs.prototype.onSelect = function (data, e) {
		this.showTab(data.target);
	};

	Tabs.prototype.showTab = function (name) {
		this.area('body', this.area(name));
	}

	cx.view('tabs', Tabs);

})();

