(function() {
   "use strict";

    cx.view('menu', {

		init: function() {

		},

        onItemClick: function(data, e) {
            console.log('menu was clicked with params', data);
        }

    });

})();