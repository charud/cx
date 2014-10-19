cx
==

A frontend framework with maintainability, flexibility and simplicity in mind 

Views
==

There are three ways to define a View:

Using a function:

	function Menu() {

	}

	Menu.prototype.onSelectItem = function(data, e) {
		console.log('Item selected with params', data, 'Menu element', this.elm);
	}

	cx.view('menu', Menu);

Using an object directly in the register function:

	cx.view('menu', {
		onSelectItem: function(data, e) {
			console.log('Item selected with params', data, 'Menu element: ', this.elm);
		}
	};

Or using a function directly in the register function:

	cx.view('menu', function() {
		this.onItemClick = function() {
			console.log('Item selected with params', data, 'Menu element: ', this.elm);
    	};
	});

If an object is passed to cx.view an empty function will be created and the methods
on the object will be moved over to its prototype. This will give your methods access to
a 'this' context that points to your view.

The view object contains the 'elm' property which points to the HTML element that the
current view instance is working with. It also contains the following helpers methods:

- findArea(name)
	Will return the first element in the current view with a _data-area_ value
	that matches the name supplied.

In addition events can be triggered using the data-action attribute. When an element with
a data-action attribute is clicked the event will be routed to its corresponding camel-cased
method in the view. A click on a the following div:

	<div data-view='foo'>
		<div data-action='pressed'>Press me</div>
	</div>

Will trigger the method in the following example view:

	cx.view('foo', {
		onPressed: function(data, e) {
			e.target.innerHTML = 'I was pressed!';
		}
	});

Parameters can be passed using data attributes:

	<div data-view='foo'>
		<div data-action='pressed' data-name='first'>Press me!</div>
		<div data-action='pressed' data-name='second'>No, press me!</div>
	</div>

And

	cx.view('foo', {
		onPressed: function(data, e) {
			this.elm.innerHTML = data.name + ' was pressed!';
		}
	});

The following tab module is an example of these concepts working together

Javascript:

	cx.view('tabs', {
		onSelect: function() {
			this.findArea('body').innerHTML = this.findArea(data.target).innerHTML;
		}
	});

HTML:

	<div data-view="tabs">
        <div>
            <div data-action="select" data-target="tab1">Tab 1</div>
            <div data-action="select" data-target="tab2">Tab 2</div>
            <div data-action="select" data-target="tab3">Tab 3</div>
        </div>
        <div data-area="tab1" style="display: none">The first tab</div>
        <div data-area="tab2" style="display: none">The second tab</div>
        <div data-area="tab3" style="display: none">The third tab</div>
        <div data-area="body"></div>
    </div>



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