cx
==

cx is short for context. It provides a context and encapsulation for
your views on the frontend, in a lightweight and non-obtrusive
way.

Motivation
==
Single-page applications are all the hype nowadays. But I wrote this
library because many of my private and professional projects are still
classical multipage applications with most of the logic on the backend. 

cx provides a way to prevent JavaScript spaghetti with minimal abstraction and 
boilerplate. 

cx aims to be small and compatible so it does not include or require any other library. It has a few helpers that should limit the need for libraries like jQuery. But you are completely free to complement cx with other libraries to make your life simpler. I work with the combination cx + jQuery myself in a few projects at work.

What does it do
==
The main concept that makes cx useful is its views. A view looks like this in HTML:

	<div data-view='expandable'>
		Lorem ipsum dolor sit amet, consectetur... 
		<span data-action="expand">Expand</span>
   		<div data-area="long">dipiscing elit. Mauris tempor faucibus condimentum. Integer facilisis erat sem, ultrices tincidunt odio vulputate eu.</div>
	</div>
	
	
And like this in JS:

```
cx.view('expandable', function() {
	this.init = function() {
		this.area('long').style.display = 'none';
	};

	this.onExpand = function() {
		this.area('long').style.display = 'block';	
	};
});
```

The data-action attribute makes it easier to follow what is going to happen when the user interacts with your template. Because the action belongs to its parent view you will always know where its handler is defined (no more searches after hidden Javascript event handlers that sneakily attaches themselves to elements).

Since cx makes no assumptions about whether you are using jQuery or any other frontend library, all elements are handled natively. Because of that the data-area attribute is there for convinience. It is basically a wrapper for querySelector() within your view. It also has some extra functionality like setting values and unwrapping promises.

You can add as many data-views and actions as you wish without having to worry about things slowing down. All data-actions are handled by one single event for clicks, and one for keydown (useful for input fields). The code will then look for the closest data-view that the click action should be routed to.

The view is resuable and every element with a data-view will have its own context, so defining non-shared state works:

```
<div data-view='counter'>
	Number A: <div data-area="number">0</div>
	<div data-action='add'>Add</div>
</div>

<div data-view='counter'>
	Number B: <div data-area="number">0</div>
	<div data-action='add'>Add</div>
</div>

cx.view('counter', function() {
	this.number = 0;
	this.onAdd = function() {
		this.area('number', ++this.number);
	}
});
```

The two counters will count independently from each other.

Get started
==
Include cx.js and cx.views.js at the bottom of your page and run cx():

```
[...]
<div data-view='myView'></div>

<script type="text/javascript" src="js/lib/cx.js"></script>
<script type="text/javascript" src="js/lib/cx.views.js"></script>
<script type="text/javascript" src="js/views/myView.js"></script>
<script type="text/javascript">
    cx();
    // cx.info(); for optional debug info in console about loaded views and internal cx plugins 
</script>
</body>
</html>
```

cx playes nice with minifiers like uglify and the order in which the files are included does not matter.

Views
==

Definition
--
There are three ways to define a View:

#### By defining a function 
And pass it to the view function. This option makes it possible to define 
code to be run when the view is registered (inside the main function). 
If you need access to the views html element you will need to put your 
initialization code in the optional Menu.prototype.init() method 
where _this.elm_ will be available.

```
function Menu() {

}

Menu.prototype.onSelectItem = function(data, e) {
	console.log(data, this.elm);
}

cx.view('menu', Menu);
```

#### By providing an object
An empty function will be created and the methods on the object will be moved
over to its prototype. This will give your methods access to a 'this' context
that points to your view.

```
cx.view('menu', {
	onSelectItem: function(data, e) {
		console.log(data, this.elm);
	}
};
```

#### By providing an anonymous function
And pass it directly to the view function. It gives the opportunity to use a private scope and is less verbose than using the solution above with prototype. 

This is the least performant option since this function will be redefined for every instance of the view that is created, but this might not matter if your applications doesn't deal with a large amount of views.

```
cx.view('menu', function() {
	this.onSelectItem = function() {
		console.log(data, this.elm);
	};
});
```

The view object contains the 'elm' property which points to the HTML element that the
current view instance is working with.

Parameters
--

You can pass a View parameters to customize its behavior. It is done using data attributes:

```
<div data-view="myView" data-kind="apple" data-color="green"><
</div>
```
	
And can be read like this:

```
cx.view('myView', function() {
	this.init = function() {
		console.log('Color:', this.params.color);
	}
});
```

If you wish to inject parameters from the backend into a view, data attributes might be too clumpy. Parameters can also be passed with JSON like this:

```
<div data-vew="myView" data-params-id="myViewParams">
	[...]
	<script id="myViewParams" type="application/json">
	    {
	    	kind: "apple",
	    	color: "green"
	    }
	</script>
</div>
```

Parameters injected with JSON can be read the same way as parameters set by data attributes can:

```
cx.view('myView', function() {
	this.init = function() {
		console.log('Color:', this.params.color);
	}
});
```

Actions
--
Events can be triggered using the data-action attribute. When an element with
a data-action attribute is clicked the event will be routed to its corresponding camel-cased
method in the view. A click on a the following div:

```
<div data-view='foo'>
	<div data-action='pressed'>Press me</div>
</div>
```

Will trigger the method in the following example view:

```
cx.view('foo', function() {
	this.onPressed = function(data, e) {
		e.target.innerHTML = 'I was pressed!';
	};
});
```

#### Action Parameters
Parameters to data-actions can be passed using data attributes:

```
<div data-view='foo'>
	<div data-action='pressed' data-name='first'>Press me!</div>
	<div data-action='pressed' data-name='second'>No, press me!</div>
</div>
```

And retrieved like this:

```
cx.view('foo', function() {
	this.onPressed = function(data, e) {
		this.elm.innerHTML = data.name + ' was pressed!';
	};
});
```

Areas
--
By putting a data-area attribute on an element in your view you can make it
easily referenceable from your View code:

```
<div data-view="foo">
	<div data-area='myArea'></div>
</div>
```

And

```
cx.view('foo', function() {
	this.init = function() {
		this.area('myArea').innerHTML = 'foobar';
	};
});
```

The area method will return the first element in the current view with a _data-area_ value
that matches the name supplied. If a second parameter is supplied the area's innerHTML will be set to that parameter's value. A promise or another element (such as another area) can also be passed:

```
this.area('myArea', 'myValue'); // pure value
this.area('myArea', cx.get('/api/somedata')); // promise
this.area('myArea', this.area('anotherArea')); // another element
```

Example
--

The following tab module is an example of these concepts working together

HTML:

```
<div data-view="tabs">
	<div>
	    <div data-action="select-tab" data-target="tab1">Tab 1</div>
	    <div data-action="select-tab" data-target="tab2">Tab 2</div>
	    <div data-action="select-tab" data-target="tab3">Tab 3</div>
	</div>
	<div data-area="tab1" style="display: none">The first tab</div>
	<div data-area="tab2" style="display: none">The second tab</div>
	<div data-area="tab3" style="display: none">The third tab</div>
	<div data-area="body"></div>
</div>
```

Javascript:

```
cx.view('tabs', {
	onSelectTab: function() {
		this.area('body', this.area(data.target));
	}
});
```

Events
--

Custom events can be triggered or listened to by using the event module (cx.events.js). Useful is you are not complementing cx with another library that fulfils the same purpose.

```
cx.emitEvent([elm], [eventName], [eventParameters]);

cx.onEvent([elm], [eventName], [callback]);
```
	
Example:

```
var myDiv = document.getElementById('someDiv');

cx.onEvent(myDiv, 'selected', function(params) { 
	console.log(params.foo, ' was selected'); 
});

cx.emitEvent(myDiv, 'selected', { foo: 'bar' });
```

Ajax
--
Ajax requests (XMLHttpRequest) can be done using the ajax module (cx.ajax.js). Useful is you are not complementing cx with another library that fulfils the same purpose.

It has two methods: cx.get(url) for GET requests and cx.post(url, data) for POST requests. They both return a promise.
For now they are dependent on RSVP.js, so you would need to bundle your application with it for these methods to work.

```
cx.view('myView', function() {
	this.loadMore = function() {
		this.params.pageNumber++;
		var that = this;
		cx.get('/api/pages/' + this.params.pageNumber).then(function(result) {
			that.elm.innerHTML = result;
		});
	};
});
```
	
Communication between views
--

Sometimes you want to control another another view. A parent view can get an instance of and control its child views, and child views can emit events for their parents to listen to:

```
<div data-view='imageGallery'>
	<div data-view='selector'>
		<!-- data-action will prevent link navigation -->
		<a href="#" data-action="select" data-src="apple.png" />
		<a href="#" data-action="select" data-src="tree.png" />
	</div>
	<img data-area='selectedImage' />
</div>
```

Here we want the selector to take care of all logic relating to image selection. Not that much in this example,
but could get a bit longer if you need to do something more like a dropbox. First we get hold of the view of the selector (using the view property that all DOM elements with a data-view attribute gets), and then we can subscribe to the 'selection' it will emit.

```
cx.view('imageGallery', function() {
	this.init = function() {
		var selector = this.find('[data-area="selector"]').view;
		var that = this;
		// if you are using jQuery: $(selector).on('selection', ...) would work too
		cx.onEvent(selector, 'selection', function(src) {
			that.area('selectedImage').src = src;
		});
	};
});

cx.view('selector', function() {
	this.onSelect = function(params) {
		// if you are using jQuery: $(this).trigger('selection', params.src) would work too
		cx.emitEvent(this, 'selection', params.src);
	};
});
```

Using the view instance the parent can also call methods directly on its child view:

```
cx.view('imageGallery', function() {
	this.init = function() {
		var selector = this.find('[data-area="selector"]').view;
		selector.gotoPage(2);
	};
});

cx.view('selector', function() {
	this.gotoPage = function(pageNumber) {
		var that = this;
		// Making an ajax request, cx.get is simply a promise enabled wrapper for XMLHttpRequest
		cx.get('/api/pages/' + pageNumber).then(function(result) {
			that.elm.innerHTML = result;
		});
	}
});
```

	
License
==

The MIT License (MIT)

Copyright (c) 2014 Charlie Rudenstål

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
