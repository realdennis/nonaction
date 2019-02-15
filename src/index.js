import React, { createContext, useContext } from 'react';
const RootContext = createContext(null);
export const Container = hook => {
  // Each hook has uniquely id
  return {
    _id: Symbol(),
    hook
  };
};
export const Provider = ({ children, inject }) => {
  // Initial 把 inject 上的每個 container 都 initial
  // Hook週期綁定在 Provider 那層
  // 再塞進去 Provider 的value裡頭 大家 share context
  const Collect = {};
  inject.forEach(Container => (Collect[Container._id] = Container.hook()));
  return (
    <RootContext.Provider value={Collect}>{children}</RootContext.Provider>
  );
};
export const useProvided = _container => {
  // 取出 Context 上對應的東西
  // 依照該 Container 的 id 取出對應的 Context value
  const ContextValue = useContext(RootContext);
  return ContextValue[_container._id];
};
