(function() {
   "use strict";

    cx.view('menu', {

		init: function() {
			cx.onEvent(this.elm, 'click').then(function() {
				alert('Clicked');
			})
		},

        onItemClick: function(data, e) {
            console.log('menu was clicked with params', data);
        }

    });

})();