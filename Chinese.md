# nonaction

**佛系** 狀態管理 [Demo](https://codesandbox.io/s/03q5n1vp0)
<br/>
![佛系](https://i.imgur.com/G5iN0D2.png)

---

~~不寫 Action 不寫 Reducer 不管 Middleware 時候到了狀態自然管理起來~~

1.  把要共享的操作寫成 Hooks
2.  **nonaction** 會給你~~一對翅膀~~ `useProvided`
3.  在子組件把 Hook 鉤進來爽用

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
export default Container(hook); //記得要包在Container裡頭
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

先來回想一下我們平常怎麼使用 Context API？

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
//然後假設 Child1 要用到Context1
const Child1 = () => {
  return (
    <>
      <Context1.Consumer>{value => <p>{value}</p>}</Context1.Consumer>
    </>
  );
};
```

Context 非常棒，但是 **多個 Context** 的話會變這樣

```javascript
<Context1.Provider>
  <Context2.Provider>
    <Context3.Provider>
      <Context4.Provider>
        ...
        // 很煩 而且一個Provider對應一個Consumer
        // Maybe a Context Hell

```

當然你也可以透過一個 Context 把所有要共享的東西放一起

```javascript
<Context1.Provider={{stateA,stateB,stateC}} >
	<Child />
</Context1.Provider>
```

但是潛在危害是 Provider 底下的子組件可以互相操作、拿到到其他人的 state ，有點違反**最小權限原則**。

如果有一個 Library 可以讓你把所有的狀態放在頂層，各自的子組件只拿出對應的 Context value 拿出來出來，是不是感覺挺棒的呢？

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

// 如果以後某個 nested 的 component 也要使用 counter 的狀態
// 一樣 import useCounter 進來 透過我給你的鉤子去操作
```

這樣感覺挺不賴的吧？
**這就是 nonaction 想解決的問題！**

---

LICENSE MIT © 2019 realdennis
