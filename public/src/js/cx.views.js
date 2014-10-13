(function () {
    "use strict";

    var views = {};
    var root = document.body;

    cx.plugin('views', {
        init: function () {
            // Associate all elements with a data-view attribute with an instance of that view
            var nsViews = document.querySelectorAll('[data-view]');
            Array.prototype.forEach.call(nsViews, createViewForElement);

            // Setup a handler for event delegation to all views and their actions
            bindRoot();
        },

        info: function () {
            console.info('loaded views');
            console.dir(views);
        },

        extend: function () {
            return {view: registerView}
        }
    });

    function bindRoot(view) {
        root.addEventListener('click', onRootEvent);
    }

    /**
     * This method is used for delegating all events on elements with a data-action attribute.
     * It will route the event to the closest parent view (with a data-view attribute)
     *
     * @param e
     */
    function onRootEvent(e) {
        if (!e.target.hasAttribute('data-action')) {
            return;
        }
        var elmView = util.closest(e.target, '[data-view]');
        var actionName = e.target.getAttribute('data-action');
        var params = util.getDataAttributes(e.target);
        delete params['action'];
        emitAction(elmView, actionName, params, e);
    }

    function emitAction(elm, actionName, params, e) {
        if (typeof elm.view[actionName] !== 'undefined') {
            elm.view[actionName](params, e);
        }
    }

    /**
     * Will convert the view object a into function which can be instantiated
     * when the view is later called upon
     *
     * Example call:
     *
     *      registerView('myView', { onSelect: function(params, e) {}, [...] });
     *
     * with the global alias
     *
     *      cx.view(..., ...);
     *
     * @param name String
     * @param viewObject Object with Actions
     */
    function registerView(name, viewObject) {
        var View = function () {
        };
        for (var key in viewObject) {
            View.prototype[key] = viewObject[key];
        }
        views[name] = View;
    }

    /**
     * Will look at the data-view property of the element given
     * and instantiate a view that was registered with that name
     * and define a view property on the element referencing to the view
     *
     * @param elm
     */
    function createViewForElement(elm) {
        var viewName = elm.getAttribute('data-view');
        if (viewName in views) {
            var View = views[viewName];
            var view = new View();
            view.elm = elm;
            Object.defineProperty(elm, 'view', {value: view});
        }
    }

    var util = {
        // http://stackoverflow.com/questions/15329167/closest-ancestor-matching-selector-using-native-dom
        closest: function (elm, selector) {
            var matchesSelector = elm.matches || elm.webkitMatchesSelector || elm.mozMatchesSelector || elm.msMatchesSelector;
            while (elm) {
                if (matchesSelector.bind(elm)(selector)) {
                    return elm;
                } else {
                    elm = elm.parentElement;
                }
            }
            return false;
        },

        // http://stackoverflow.com/questions/4187032/get-list-of-data-attributes-using-javascript-jquery
        toCamelCase: function (str) {
            return str.substr(5).replace(/-(.)/g, function ($0, $1) {
                return $1.toUpperCase();
            });
        },

        // http://stackoverflow.com/questions/4187032/get-list-of-data-attributes-using-javascript-jquery
        getDataAttributes: function (elm) {
            var data = {};
            [].forEach.call(elm.attributes, function (attr) {
                if (/^data-/.test(attr.name)) {
                    data[util.toCamelCase(attr.name)] = attr.value;
                }
            });
            return data;
        }

    }

})();