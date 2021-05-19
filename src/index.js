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
  /*
  ** 1. Inject each containers at initial
  ** 2. Attach hooks on the same Provider
  ** 3. Store in Provider value, share context
  */
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
export const useProvided = _container => {
  // Get the corresponding context value from sharedProvider using container ID.
  const ContextValue = useContext(RootContext);
  return ContextValue[_container._id];
};
