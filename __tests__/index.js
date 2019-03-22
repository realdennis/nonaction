import React, { useState } from 'react';
import { Container, Provider, useProvided } from '../src/index.js';
import { cleanup, render, fireEvent } from 'react-testing-library';
afterEach(cleanup);

const counterHook = (initialState = 0) => {
  const [count, setCount] = useState(initialState);
  const add = val => setCount(count + val);
  const sub = val => setCount(count - val);
  const reset = () => setCount(initialState);
  return { count, add, sub, reset };
};
const counterContainer = Container(counterHook);

test('Container should work nicely when it wrap hook', () => {
  expect(typeof counterContainer._id).toEqual('symbol');
  expect(typeof counterContainer.hook).toEqual('function');
});

const Sibling1 = () => {
  const { add, sub } = useProvided(counterContainer);
  return (
    <>
      <button data-testid="btn-add" onClick={() => add(1)}>
        +1
      </button>
      <button data-testid="btn-sub" onClick={() => sub(1)}>
        -1
      </button>
      <button data-testid="btn-reset" onClick={() => reset()}>
        reset
      </button>
    </>
  );
};
const Sibling2 = () => {
  const { count } = useProvided(counterContainer);
  return <p data-testid="panel-count">{count}</p>;
};
const SimpleApp = () => {
  return (
    <Provider inject={[counterContainer]}>
      <Sibling1 />
      <Sibling2 />
    </Provider>
  );
};

test('Two components shared hook', () => {
  const { getByTestId } = render(<SimpleApp />);
  expect(getByTestId('panel-count').innerHTML).toEqual('0');
  fireEvent.click(getByTestId('btn-add'));
  expect(getByTestId('panel-count').innerHTML).toEqual('1');

  fireEvent.click(getByTestId('btn-add'));
  fireEvent.click(getByTestId('btn-add'));
  expect(getByTestId('panel-count').innerHTML).toEqual('3');

  fireEvent.click(getByTestId('btn-sub'));
  expect(getByTestId('panel-count').innerHTML).toEqual('2');
});


test('Cleanup are still working', () => {
  const { getByTestId } = render(<SimpleApp />);
  expect(getByTestId('panel-count').innerHTML).toEqual('0');
});