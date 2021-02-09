# Kiq.js
Blazing fast virtual DOM class component based library for reactive UI

## Thanks :heart:
[Jáchym Janoušek](https://github.com/jachymjanousek)    
[Jan Turoň](https://github.com/janturon)

## Download

[![](https://data.jsdelivr.com/v1/package/npm/kiq/badge)](https://www.jsdelivr.com/package/npm/kiq)
[![npm version](https://badge.fury.io/js/kiq.svg)](https://badge.fury.io/js/kiq)

## Inspiration
React.js for virtual DOM, components and performance tips    
Jason Yu that creates simple virtual DOM library in about 50 minutes    
Solid.js for performance tips    

## Goal
Goal is to create very simple, lightweight and very fast virtual DOM library with smart diff algorithm and performance optimalizations.

## Javascript should not be pain
This library allows you to don't care about DOM and DOM updates, you will only work with data and leave DOM on us.
Every DOM changes are done surgically and every virtual node is hooked on real node on page, so you can use third-party libraries in combination with this library (Avoid manipulate Kiq real nodes, else Kiq is confused). 

## What about speeeeeeed?
Kiq.js is faster than libraries that doing same thing like React.js, Vue.js, etc...
Every test has 2x warmup run and every row (component) is keyed.

Create 1000 rows on 8gb ram, no throttling - Kiq.js: 257ms, React.js: 425ms    
Remove 1000 rows - Kiq.js: 39ms, React.js: 55ms    
Create 10000 rows - Kiq.js: 1050ms, React.js: 1329ms    
Appending 1000 rows to 10000 rows - Kiq.js: 363ms, React.js: 758ms     

Row component:
```
class Row extends Kiq.Component {

    Element() {

        const data = this.props.data;

        return html`
		<tr>
			<td className="col-md-1">${data.id}</td>
			<td className="col-md-4">
				<a>${data.label}</a>
			</td>
			<td className="col-md-1"><a><span className="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>
			<td className="col-md-6"></td>
		</tr>`;

    }

}
```

## How can be faster than these libraries?
It is optimized by requestAnimationFrame so when there are DOM changes, browser is ready to reflow and repaint, bundling DOM changes into one bundle and do it in one time, so browser don't reflow and repaint every time, small size and simple data control.

## Can this library be faster than Svelte?
Svelte is compiler and Kiq is javascript library, but sometimes Kiq can be faster and smaller than Svelte bundle.

## Can this library be faster than vanilla javasript?
It can't, cause it is written in javasript, but because of some optimalization, it can be faster than DOM manipulation without these optimalizations.

## So why to use this library, when vanilla javascript is faster?
Yes vanilla javascript is faster, but c++ is faster than javascript or assembler is faster than c++, so if speed and performance is the only thing that we want, why we don't write code only in assembler? Because other languages are cleaner, more simple, faster to work and learn them. Creating apps in Kiq.js is cleaner and faster too than in the javascript.

## What about components?
Components are simple javascript classes (constructor functions).

## Why classes, not functions?
Because classes are better for component lifecycles, clearer encapsulation and for recognizing components and another classes and functions.
The second reason is that the classes are faster in complex data because in function all hooks function trigger again, in classes there are no hooks, so on every rerender trigger only Element method with virtual node.

## Compatibility
All browsers that supports ES5 (IE11)

## htm.js
If you want you can use htm.js library for better virtual nodes syntax.
htm.js transform classic functional syntax to literal string tagged template function.    

cdn:    
```
https://cdnjs.com/libraries/htm
```    

htm.js transform from this:
```
Kiq.createElement('div', { className: 'test' }, count);
```
to this: 
```
const html = htm.bind(Kiq.createElement);

html`<div className="test">${ count }</div>`
```

Or you can use JSX pragma comment
```
/** @jsx Kiq.createElement */

<div className="test">{ count }</div>

```
But you have to use transpiler like babel.js with jsx plugin

## createElement
This function is most-used function in Kiq.js, it produces virtual nodes (plain javascript objects).
It can be replaced with htm.js or jsx, but both only transform function syntax to html-like syntax, but htm still trigger createElement function and jsx babel transpiler, transpile html-like syntax to createElement functions.

```
Kiq.createElement('div', null, 'Hello, world');
```

### create components in createElement
Produce components is the same as virtual nodes, but the first parameter replace tag name with your component.
Attributes are props and children are ```props.children```.

### props.children
In the component props can be passed as children too.
Your children are then in props.children Array.

This example is created with jsx for clarity.
```
<Parent>
	<Child />
</Parent>
```

```
Kiq.createElement(Parent, null, 
	Kiq.createElement(Child);
);
```

The Parent component has now access to special ```props.children``` Array where on the first index is Child component.

## render
This function should be called only once in the app.
It render your app and produce real DOM objects and mount them to your page.

```
Kiq.render(Kiq.createElement(App), document.getElementById('app'));
```

## Components example

``` 
class Counter extends Kiq.Component {

    state = {
        count: 0
    };

	Element(props, state) {

        return Kiq.createElement('button', { onclick: (e) => this.setState({ count: state.count + 1 }) }, state.count);

    }
}
```

## Components in ES5
If you want to your code is compatible with IE11 and other ES5 browsers you can use ES5 syntax or use babel.js transpiler.

```
function Counter() {
	
	Kiq.Component.call(this);

	this.state = {
		count: 0
	};

	this.Element = function() {

		return Kiq.createElement('button', { onclick: function() { this.setState({ count: this.state.count + 1 }); }.bind(this) }, this.state.count);

	};

}

Counter.prototype = Kiq.Component.prototype;
```

## state and props
These two are data that is used inside component.
Simply props are "function parameters" and state are "function local variables", so props are not private inside component and income from the outside.
State are private in component and there is not way to set state of component in another component (actually there is a way to do that, it is in the article below).
State are reactive object, props are non reactive object, props should be only read-only.

## setState
Component.setState component method can be only called if component is rendered, will mount or is mounted, else it throws error.
You shouldn't to mutate the original value of state as you can see in the example, instead of ```++state.count``` use 
```state.count + 1```.
On every setState call component will rerender, so on multiple changes, use setState only once and do all the changes in one.
setState is not asynchronnous function.

### Can I set props?
No. There is no way to set props, because it is anti-pattern.
Props should be read-only.

### How to setState of parent component inside child component? 
It is simple, you have to pass the "setter" function to the props of child component like this:

```
class Parent extends Kiq.Component {

    state = {
        count: 0
    };

	//use arrow function for auto bind that method to "this"
	//if you use classic method you have to bind that method manually

	setCount = (event) => {

		this.setState({
			count: this.state.count + 1
		});

	}

	Element(props, state) {

        return Kiq.createElement(Child, { setCount: this.setCount, count: state.count });

    }
}

class Child extends Kiq.Component {

	Element(props, state) {

        return Kiq.createElement('button', { onclick: props.setCount }, props.count);

    }
}
```
