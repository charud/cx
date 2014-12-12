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

	var isPageInitialized = false;

	cx.plugin('views', {
		init: function () {
			// Associate all elements with a data-view attribute with an instance of that view
			createViews(document.body);

			// Setup a handler for event delegation to all views and their actions
			bindRoot();

			// we need to know which views have already loaded to only call staticInit once per type of view
			var initializedViews = {};

			for (var i in viewInstances) {
				var view = viewInstances[i];
				if (view.staticInit && !(view.name in initializedViews)) {
					view.staticInit();
					initializedViews[view.name] = true;
				}

				var jsonData = util.getJsonAttributes(view.elm);
				var tagData = util.getDataAttributes(view.elm);
				var params = util.merge(jsonData, tagData);
				view.params = params;

				if (view.init) {
					view.init(params);
				}
			}

			// this way we know that to init views, that renders later, immediately
			isPageInitialized = true;
		},

		info: function () {
			console.info('loaded views');
			console.dir(views);
		},

		extend: function () {
			return {
				view: registerView,
				createViews: createViews
			}
		}
	});

	function bindRoot() {
		root.addEventListener('click', onRootEvent);
		// keyup for input fields
		root.addEventListener('keyup', onRootEvent);
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
			if (!elmAction) {
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

		// add the value attribute as a parameter for input fields
		if (elmAction.value) {
			params.value = elmAction.value;
		}

		// create a custom event object so that we can modify currentTarget
		// (the normal event object does not appear to be mutable)
		var cxEvent = {
			originalEvent: e,
			target: e.target,
			currentTarget: e.currentTarget
		};

		// update e.currentTarget to be equal to the data-action element so it can be traced by the view code
		// (the previous e.currentTarget will always be the view root element, typically body)
		cxEvent.currentTarget = elmAction;

		emitAction(elmView, actionName, params, cxEvent);
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
			var elmArea = this.findFirst('[data-area=' + name + ']');
			if (typeof valueOrPromise === 'undefined') {
				return elmArea;
			} else {
				setElementValue(elmArea, valueOrPromise);
			}
		};

		View.prototype.areas = function (name, valueOrPromise) {
			var areas = this.find('[data-area=' + name + ']');
			if (typeof valueOrPromise === 'undefined') {
				return areas;
			} else {
				areas.forEach(function (area) {
					setElementValue(area, valueOrPromise);
				});
			}
		};

		var setElementValue = function (elm, valueOrPromise) {
			// unbox the value if it is a promise
			if (valueOrPromise === null) {
				elm.innerHTML = '';
			} else if (valueOrPromise.then) {
				valueOrPromise.then(function (value) {
					elm.innerHTML = value;
					// make sure to initialize views for the loaded content
					cx.createViews(elm);
				});
				// or if an element, use its innerHTML
			} else if (valueOrPromise['innerHTML']) {
				elm.innerHTML = valueOrPromise.innerHTML;
			} else {
				elm.innerHTML = valueOrPromise;
			}
		};

		views[name] = View;
	}

	function createViews(elmRoot, excludeRoot) {
		var nsViews = elmRoot.querySelectorAll('[data-view]');
		if (!excludeRoot) {
			createViewForElement(elmRoot);
		}
		Array.prototype.forEach.call(nsViews, createViewForElement);
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

		// no data-view defined for this element? don't create a view for it
		if (!viewName) return;

		// does this element already have a view associated with it? don't create a new one
		if (elm.view) return;

		if (viewName in views) {
			var View = views[viewName];
			var view = new View();
			view.elm = elm;
			view.name = viewName;

			Object.defineProperty(elm, 'view', {value: view});
			viewInstances.push(view);

			// init this view immediately if the page is already initialized
			// (if this view has been loaded later through ajax for example)
			if (isPageInitialized) {
				if (view.init) {
					view.init();
				}
			}

		} else {
			// console.log('cx: View', viewName, 'used but not found on element', elm);
		}
	}

	var util = {};

	// http://stackoverflow.com/questions/15329167/closest-ancestor-matching-selector-using-native-dom
	util.closest = function (elm, selector) {
		var matchesSelector = elm.matches || elm.webkitMatchesSelector || elm.mozMatchesSelector || elm.msMatchesSelector;
		while (elm) {
			if (matchesSelector.bind(elm)(selector)) {
				return elm;
			} else {
				elm = elm.parentElement;
			}
		}
		return false;
	};

	// http://stackoverflow.com/questions/4187032/get-list-of-data-attributes-using-javascript-jquery
	util.toCamelCase = function (str) {
		return str.replace(/-(.)/g, function ($0, $1) {
			return $1.toUpperCase();
		});
	};

	// http://stackoverflow.com/questions/4187032/get-list-of-data-attributes-using-javascript-jquery
	util.getDataAttributes = function (elm) {
		var data = {};
		[].forEach.call(elm.attributes, function (attr) {
			if (/^data-/.test(attr.name)) {
				data[util.toCamelCase(attr.name.substr(5))] = attr.value;
			}
		});
		return data;
	};

	util.getJsonAttributes = function (elm) {
		// fetch the data-params-id which points to a script tag with that id
		var elmData = util.getDataAttributes(elm);
		var jsonAttributesId = elmData.paramsId;
		if (jsonAttributesId) {
			// fetch and check if a script tag with that id exists
			var scriptTag = elm.querySelector('script[type="application/json"]');
			if (scriptTag) {
				var strJson = scriptTag.innerHTML;
				var json = JSON.parse(strJson);
				return json;
			} else {
				return [];
			}
		} else {
			return [];
		}
	};

	util.merge = function (obj1, obj2) {
		var merged = {};
		for (var x in obj1) {
			if (obj1.hasOwnProperty(x)) {
				merged[x] = obj1[x];
			}
		}
		for (var y in obj2) {
			if (obj2.hasOwnProperty(y)) {
				merged[y] = obj2[y];
			}
		}
		return merged;
	};


})();