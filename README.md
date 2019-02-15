# nonaction

[![Join the chat at https://gitter.im/nonaction-community/community](https://badges.gitter.im/nonaction-community/community.svg)](https://gitter.im/nonaction-community/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[中文介紹](https://github.com/realdennis/nonaction/blob/master/Chinese.md)

**Nonaction** State Management [Demo](https://codesandbox.io/s/03q5n1vp0)
<br/>
![Nonaction](https://i.imgur.com/G5iN0D2.png)

---

~~No Action No Reducer No Middleware It will be managed when time comes~~

1.  Share state by wrote Hooks and wrapped in container
2.  **nonaction** will give you ~~a pair of wings~~ `useProvided`
3.  using hook in Child Components

This repository is inspired by [unstated](https://github.com/jamiebuilds/unstated), but not really similar, what I actually do is merge the Context Provider, Proxy the root context value, return the relative Container's state.

## Installation

```sh
$ npm install nonaction
```

## Usage

```
src
-- App.jsx
-- Store
---- useCounter.js
-- Component
---- Counter.jsx
```

_useCounter.js_

```javascript
import { Container } from 'nonaction';
const initialState = 0;
const hook = () => {
  const [count, setCount] = useState(initialState);
  const add = val => setCount(count + val);
  const sub = val => setCount(count - val);
  return { count, add, sub };
};
export default Container(hook); //remenber use Container to wrap
```

_App.jsx_

```javascript
import { Provider } from 'nonaction';
import useCounter from './Store/useCounter.js';
import Counter from './Component/Counter';
export default ()=>{
	return (
		<div id="App">
			<Provdider inject={[useCounter]}>
				<Counter/>
			</Provider>
		</div>
	)
}
```

_Child.jsx_

```javascript
import { useProvided } from 'nonaction';
import useCounter from '../store/useCounter';
export default () => {
  const { count, add, sub } = useProvided(useCounter);
  return (
    <div>
      <p> Count {count} </p>
      <button onClick={() => add(1)}>+</button>
      <button onClick={() => sub(1)}>-</button>
    </div>
  );
};
```

## Explanation

Memorize how we use Context API？

```javascript
import { createContext } from 'react';
const Context1 = createContext();
const demo = () => {
  return (
    <Context1.Provider value={123}>
      <Child1 />
      <Child2 />
    </Context1.Provider>
  );
};
//Assume Child1 need Context1
const Child1 = () => {
  return (
    <>
      <Context1.Consumer>{value => <p>{value}</p>}</Context1.Consumer>
    </>
  );
};
```

Context is greate，but **multiple Context** will be...

```javascript
<Context1.Provider>
  <Context2.Provider>
    <Context3.Provider>
      <Context4.Provider>
        ...
        // Very annoying On Provider need One Consumer
        // Context Hell

```

In fact, You just use one Context share everything like this:

```javascript
<Context1.Provider={{stateA,stateB,stateC}} >
	<Child />
</Context1.Provider>
```

But potential danger is that every Components under Provider could be share/manipulate state, not complying **Principle_of_least_privilege**.

If there exsits Library, let you place every context in the root provider, but child components only take their Context value, it will be very convenience.

```javascript
import { Provider } from 'nonaction';
import { useCounter ,useText } from './store';
const App = ()=>{
	return (
	<Provider inject={[useCounter,useText,...]}>
		<ChildA>
		<ChildB>
	</Provider>
	)
}

//In ChildA
import useCounter from '../store/useCounter'
export default ()=>{
	const counter = useProvided(useCounter)
	return (
		<>
			<p>Count : {count}</p>
			<button onClick={()=>counter.add(1)}>+</button>
			<button onClick={()=>counter.sub(1)}>-</button>
		</>
	)
}

//In ChildB
import useText from '../store/useText';
export default ()=>{
	const text = useProvided(useText);
	return (
		<>
			<p>text {text.text}</p>
			<button onClick={text.bang}>bang</button>
			<button onClick={text.reset}>reset</button>
		</>
	)
}

/* In future, if nested component also need to use counter's hooks
 * also import useCounter, and manipulate by useProivded.
 */

```

That will be awesome, right?
**That's the problem nonaction want to solve.**

---

LICENSE MIT © 2019 realdennis
