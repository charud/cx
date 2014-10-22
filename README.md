cx
==

A frontend framework with maintainability, flexibility and simplicity in mind 

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
And pass it directly to the view function. This is the least performant option since this function
will be redefined for every instance of the view that is created.

```
cx.view('menu', function() {
	this.onSelectItem = function() {
		console.log(data, this.elm);
	};
});
```

The view object contains the 'elm' property which points to the HTML element that the
current view instance is working with.

Actions
--
Events can be triggered using the data-action attribute. When an element with
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

#### Parameters
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

Areas
--
By putting a data-area attribute on an element in your view you can make it
easily referenceable from your View code:

	<div data-view="foo">
		<div data-area='myArea'></div>
	</div>

And

	cx.view('foo', {
		init: function() {
			this.area('myArea').innerHTML = 'foobar';
		}
	});

The area method will return the first element in the current view with a _data-area_ value
that matches the name supplied. If a second parameter is supplied the area's innerHTML will be set to that parameter's value. A promise or another element (such as another area) can also be passed:

	this.area('myArea', 'myValue'); // pure value
	this.area('myArea', cx.get('/myArea/1')); // promise
	this.area('myArea', this.area('anotherArea')); // another element

Example
--

The following tab module is an example of these concepts working together

HTML:

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

Javascript:

	cx.view('tabs', {
		onSelectTab: function() {
			this.area('body', this.area(data.target));
		}
	});


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
