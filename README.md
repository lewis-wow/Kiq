# Kiq.js

Blazing fast virtual DOM class component based library for reactive UI

## Inspiration

React.js for virtual DOM, components and performance tips
Jason Yu that creates simple virtual DOM library in about 50 minutes

## Goal

Goal is to create very simple, lightweight and very fast virtual DOM library with smart diff algorithm and performance optimalizations.

## Optimalizations

It is optimized by requestAnimationFrame so when there are DOM changes, browser is ready to reflow and repaint, bundling DOM changes into one bundle and do it in one time, so browser don't reflow and repaint every time, small size and simple data control.

## Components

Components are javascript classes.

## htm.js

If you want you can use htm.js library for better virtual nodes syntax.
htm.js transform classic functional syntax to literal string tagged template function.

### using vanilla js

```js
Kiq.createElement('div', { className: 'test' }, count)
```

### using htm.js

```js
const html = htm.bind(Kiq.createElement);

html`<div className="test">${count}</div>`
```

### using jsx with babel

```js
/** @jsx Kiq.createElement */

<div className="test">{count}</div>
```

## createElement

This function is most-used function in Kiq.js, it produces virtual nodes (plain javascript objects).
It can be replaced with htm.js or jsx, but both only transform function syntax to html-like syntax, but htm still trigger createElement function and jsx babel transpiler, transpile html-like syntax to createElement functions.

```js
Kiq.createElement('div', null, 'Hello, world');
```

### create components in createElement

Produce components is the same as virtual nodes, but the first parameter replace tag name with your component.
Attributes are props and children are ```props.children```.

### props.children

In the component props can be passed as children too.
Your children are then in props.children Array.

```js
<Parent>
  <Child />
</Parent>
```

```js
Kiq.createElement(Parent, null, 
  Kiq.createElement(Child);
);
```

The Parent component has now access to special ```props.children``` Array where on the first index is Child component.

## render

This function should be called only once in the app.
It render your app and produce real DOM objects and mount them to your page.

```js
Kiq.render(Kiq.createElement(App), document.getElementById('app'));
```

## Components example

``` js
class Counter extends Kiq.Component {
  state = {
    count: 0,
  }

  Element(props, state) {
    return (
      <button onclick={() => this.setState({ count: state.count + 1 })}>
        {state.count}
      </button>
    )
  }
}
```

## Components in ES5

If you want to your code is compatible with IE11 and other ES5 browsers you can use ES5 syntax or use babel.js transpiler.

```js
function Counter() {
  Kiq.Component.call(this);

  this.state = {
    count: 0,
  };

  this.Element = function () {
    return Kiq.createElement(
      "button",
      {
        onclick: function () {
          this.setState({ count: this.state.count + 1 });
        }.bind(this),
      },
      this.state.count
    );
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
You shouldn't to mutate the original value of state as you can see in the example, instead of ```++state.count``` use ```state.count + 1```.
Every changes should be immutable.
On every setState call component will rerender, so on multiple changes, use setState only once and do all the changes in one.
setState is synchronnous function.

### Can I set props?

No. There is no way to set props, because it is anti-pattern.
Props should be read-only.

### How to setState of parent component inside child component? 

It is simple, you have to pass the "setter" function to the props of child component like this:

```js
class Parent extends Kiq.Component {
  state = {
    count: 0,
  }

  setCount() {
    this.setState({
      count: this.state.count + 1,
    })
  }

  Element(props, state) {
    return <Child setCount={this.setCount} count={state.count} />
  }
}

class Child extends Kiq.Component {
  Element(props, state) {
    return <button onclick={props.setCount}>{props.count}</button>
  }
}
```

### Kiq.Component vs WebComponents

WebComponents are encapsulated DOM elements, but Kiq.Component is logical encapsulation of element and data definition, where is used declarative DOM management.

### Conditional rendering

```js
class Fetch extends Kiq.Component {
  state = {
    books: null,
  }

  onComponentRender() {
    fetch("https://www.anapioficeandfire.com/api/books")
      .then((res) => res.json())
      .then((res) => {
        this.setState({
          books: res,
        })
      })
  }

  Element() {
    if (!this.state.books) {
      return <h1>Loading...</h1>
    }

    return <div>{JSON.stringify(this.state.books)}</div>
  }
}
```

### List rendering

```js
class List extends Kiq.Component {
  state = {
    arr: [0, 1, 2, 3, 4],
  }

  Element() {
    return (
      <ul>
        {this.state.arr.map((item) => <li _key={item}>{item}</li>)}
      </ul>
    )
  }
}
```

### Simple mouse move

Simple mouse move example to show how easy is declarative way of DOM changes.
Declarative programming means you say what to do, but no how to do.

```js
class MouseMove extends Kiq.Component {
  state = {
    x: 0,
    y: 0,
    count: 0,
  }

  onComponentRender() {
    window.addEventListener("mousemove", (e) => {
      this.setState({
        x: e.x,
        y: e.y,
      })
    })
  }

  Element(props, state) {
    return (
      <button
        onclick={() => this.setState({ count: state.count + 1 })}
        style={{
          position: "absolute",
          left: this.state.x + "px",
          top: this.state.y + "px",
        }}
      >
        {state.count}
      </button>
    )
  }
}
```
