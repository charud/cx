(function() {
   "use strict";

    cx.view('menu', {

        onItemClick: function(data, e) {
            console.log('menu was clicked with params', data);
        }

    });

})();