(function () {
	"use strict";

	cx.view('gallery', function () {

		var curIndex = 0;

		this.init = function (data) {
			this.url = data.url;
			this.showSlide(0);
		};

		this.onPrev = function () {
			this.showSlide(curIndex - 1);
		};

		this.onNext = function () {
			this.showSlide(curIndex + 1);
		};

		this.showSlide = function (index) {
			curIndex = index;
			this.area('body', cx.get(this.url.replace(':index', index)));
		};

	});

})();