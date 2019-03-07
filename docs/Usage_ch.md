# Nonaction Usage

## 目錄

- 概述

- [Container](#Container)
- [Provider](#Provider)
- [useProvided](#useProvided)

## 概述

**Nonaction** 是一個 React 的狀態管理函式庫，透過 Context API 實現。

Nonaction 允許開發者將狀態操作寫成 Hooks 的形式，並且允許在頂層注入多個狀態操作。

### Container

#### `Container(Hook)`

- `Hook`<Function> 一個可操作狀態的 Hook function，你可以在這裡暴露狀態的 getter、setter，或是暴露操作 setter 的 function。

```javascript
const useCounter = () => {
  // Simple hook
  const [count, setCount] = useState(0);
  const add = val => setCount(count + val);
  const sub = val => setCount(count - val);
  return { count, add, sub };
};

export default Container(useCounter);
// 在這裡把狀態操作的函數透過 Container函數 封裝
```

### Provider

#### `<Provider inject={ [<Container>,<Container>] }>`

Provider 是一個高階組件，其透過 `inject` 這個 Props 將 `Container`注入。

```jsx
// Here is root component
import { Provider } from 'nonaction';
import { CounterContainer, anotherContainer } from './CounterContainer';
import Child from './Component/Child.jsx';
const App = () => {
  return (
    <Provider inject={[CounterContainer, anotherContaner]}>
      {/* 這裡開始的子組件都能 share 這個 Provider 上注入的Hooks */}
      <Child />
    </Provider>
  );
};
```

### useProvided

#### `useProvided(<Container>)`

useProvided 是一個 Custom Hooks ，其用法與 useContext 無異，它會在 Provider 所注入的 Container 尋找對應的 Container 之 Context。

```jsx
// Child.jsx

import { useProvided } from 'nonaction';
import { CountContainer } from '../CountContainer';

export default () => {
  const { count, add, sub } = useProvided(CountContainer);
  return (
    <div>
      <p>now count is {count}</p>
      <button onClick={() => add(1)}>+1</button>
      <button onClick={() => sub(1)}>+1</button>
    </div>
  );
};
```
