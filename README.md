# Kiq.js
Blazing fast virtual DOM class component based library for reactive UI

## Thanks :heart:
[Jáchym Janoušek](https://github.com/jachymjanousek)    
[Jan Turoň](https://github.com/janturon)

## Inspiration
React.js for virtual DOM, components and performance tips    
Jason Yu that creates simple virtual DOM library in about 50 minutes    
Solid.js for performance tips    

## goal
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

        return html`<tr className>
			<td className="col-md-1">${data.id}</td>
			<td className="col-md-4">
				<a>${data.label}</a>
			</td>
			<td className="col-md-1"><a><span className="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>
			<td className="col-md-6"></td>
		</tr>`

    }

}
```

## How can be faster than these libraries?
It is optimized by requestAnimationFrame so when there are DOM changes, browser is ready to reflow and repaint, bundling DOM changes into one bundle and do it in one time, so browser don't reflow and repaint every time, small size (under 2Kb min + gzip) and simple data control.

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

