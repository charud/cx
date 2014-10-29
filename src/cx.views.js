(function () {
	"use strict";

	window.cx = window.cx || {};

	// this code is used when this plugin is loaded before the cx.js main file is loaded
	if (!cx.plugin) {
		cx.pluginsToLoad = cx.pluginsToLoad || {};
		cx.plugin = function (name, plugin) {
			cx.pluginsToLoad[name] = plugin;
		}
	}

	// Registered base views
	var views = {};

	// Instances of views, each connected to an element
	var viewInstances = [];

	var root = document.body;

	cx.plugin('views', {
		init: function () {
			// Associate all elements with a data-view attribute with an instance of that view
			var nsViews = document.querySelectorAll('[data-view]');
			Array.prototype.forEach.call(nsViews, createViewForElement);

			// Setup a handler for event delegation to all views and their actions
			bindRoot();

			for (var i in viewInstances) {
				var viewInstance = viewInstances[i];
				if (viewInstance.init) {
					var data = util.getDataAttributes(viewInstance.elm);
					viewInstance.init(data);
				}
			}
		},

		info: function () {
			console.info('loaded views');
			console.dir(views);
		},

		extend: function () {
			return {view: registerView}
		}
	});

	function bindRoot() {
		root.addEventListener('click', onRootEvent);
	}

	/**
	 * This method is used for delegating all events on elements with a data-action attribute.
	 * It will route the event to the closest parent view (with a data-view attribute)
	 *
	 * @param e
	 */
	function onRootEvent(e) {
		var elmAction = e.target;
		if (!e.target.hasAttribute('data-action')) {
			// if the elment that triggered the event doesn't have a data-action
			// look if any of its parents has it
			elmAction = util.closest(elmAction, '[data-action]');
			if(!elmAction) {
				// there are no data-actions defined for this event, ignore the event
				return;
			}
		}
		e.stopPropagation();
		e.preventDefault();
		var elmView = util.closest(elmAction, '[data-view]');
		var actionName = elmAction.getAttribute('data-action');
		var params = util.getDataAttributes(elmAction);
		delete params['action'];
		emitAction(elmView, actionName, params, e);
	}

	function emitAction(elm, actionName, params, e) {
		var actionNameKey = util.toCamelCase('on-' + actionName);
		if (elm.view) {
			if (typeof elm.view[actionNameKey] !== 'undefined') {
				elm.view[actionNameKey](params, e);
			} else {
				console.log('Action ', actionNameKey, 'not found on view', elm.view);
			}
		} else {
			console.log('cx: View', elm.getAttribute('data-view'), 'not found when triggering action', actionName, 'for element', elm);
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

		if (typeof(viewObject) == 'object') {
			for (var key in viewObject) {
				if (viewObject.hasOwnProperty(key)) {
					View.prototype[key] = viewObject[key];
				}
			}
		} else if (typeof(viewObject) == 'function') {
			View = viewObject;
		}

		View.prototype.find = function (selector) {
			// convert the nodeList to a more manageable array
			var nodeList = this.elm.querySelectorAll(selector);
			var arr = Array.prototype.slice.call(nodeList);
			return arr;
		};

		View.prototype.findFirst = function (selector) {
			return this.elm.querySelector(selector);
		}

		/**
		 * Find and return an area or write to
		 * its innerHTML if valueOrPromise is specified
		 * @param name
		 * @param {valueOrPromise} If specified this value will be set as the new innerHTML for
		 * the element (and first unwrapped if it is a promise). Can also be set to an html element in which
		 * case the html elements innerHTML property will be used. This way an area can be assigned to another area easily.
		 * @returns {HTMLElement}
		 */
		View.prototype.area = function (name, valueOrPromise) {
			var elmArea = this.elm.querySelector('[data-area=' + name + ']');
			if (valueOrPromise) {
				// unbox the value if it is a promise
				if (valueOrPromise.then) {
					valueOrPromise.then(function (value) {
						elmArea.innerHTML = value;
					});
					// or if an element, use its innerHTML
				} else if (valueOrPromise['innerHTML']) {
					elmArea.innerHTML = valueOrPromise.innerHTML;
				} else {
					elmArea.innerHTML = valueOrPromise;
				}
			} else {
				return elmArea;
			}
		};

		View.prototype.areas = function(name) {
			return this.elm.querySelectorAll('[data-area=' + name + ']');
		};

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
			viewInstances.push(view);
		} else {
			console.log('cx: View', viewName, 'used but not found on element', elm);
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
			return str.replace(/-(.)/g, function ($0, $1) {
				return $1.toUpperCase();
			});
		},

		// http://stackoverflow.com/questions/4187032/get-list-of-data-attributes-using-javascript-jquery
		getDataAttributes: function (elm) {
			var data = {};
			[].forEach.call(elm.attributes, function (attr) {
				if (/^data-/.test(attr.name)) {
					data[util.toCamelCase(attr.name.substr(5))] = attr.value;
				}
			});
			return data;
		}

	}

})();