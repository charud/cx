(function () {
	"use strict";

	cx.view('gallery', function () {

		var curIndex = 0;

		this.init = function() {
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
			this.area('body', cx.get('/gallery/' + index));
		};

	});

})();