(function() {
   "use strict";

    cx.view('menu', {

		init: function() {
			cx.onEvent(this.elm, 'click', function() {
				console.log('clicked');
			});
		},

        onItemClick: function(data, e) {
			console.log('A menu item was clicked with params', data);
        }

    });

})();