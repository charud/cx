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
		// display the correct tab contents
		this.area('body', this.area(name));

		// update selection to match the now selected tab
		this.find('[data-target]').forEach(function (elm) {
			if (elm.getAttribute('data-target') == name) {
				elm.classList.add('is-selected');
			} else {
				elm.classList.remove('is-selected');
			}
		});
	};

	cx.view('tabs', Tabs);

})();

