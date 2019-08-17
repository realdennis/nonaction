import * as React from 'react';
const { createContext, useContext } = React;
const RootContext = createContext(null);
interface ContainerInstance {
  _id: symbol;
  hook: () => void;
}
export const Container: (hook: () => void) => ContainerInstance = hook => {
  // Each hook has uniquely id
  return {
    _id: Symbol(),
    hook
  };
};
interface ProviderProps {
  children?: Element;
  inject: ContainerInstance[];
}
export const Provider = ({ children, inject }: ProviderProps) => {
  // Initial 把 inject 上的每個 container 都 initial
  // Hook 週期綁定在 Provider 那層
  // 再塞進去 Provider 的 value 裡頭 大家 share context
  const Collect = {};
  Array.isArray(inject)
    ? inject.forEach(
        _container => (Collect[_container._id] = _container.hook())
      )
    : console.warn(
        '[nonaction] Seems like `inject` in your Provider is not an array?'
      );
  // Type check
  return React.createElement(
    RootContext.Provider,
    { value: Collect },
    children
  );
};
export const useProvided = (_container: ContainerInstance) => {
  // 取出 Context 上對應的東西
  // 依照該 Container 的 id 取出對應的 Context value
  const ContextValue = useContext(RootContext);
  return ContextValue[_container._id];
};
