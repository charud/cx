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

		// display the correct tab contents or load from an url if specified
		var newContent = this.area(name);
		if (newContent.getAttribute('data-url')) {
			newContent = cx.get(newContent.getAttribute('data-url'));
		}
		this.area('body', newContent);

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

