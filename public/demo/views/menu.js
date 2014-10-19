(function() {
   "use strict";

	cx.view('menu', function() {
		this.onItemClick = function() {
			console.log('hej');
		};
	});

    cx.view('menu', {

		init: function() {
			cx.onEvent(this.elm, 'click', function() {
				alert('Clicked');
			});
		},

        onItemClick: function(data, e) {
			console.log('A menu item was clicked with params', data);
        }

    });

})();