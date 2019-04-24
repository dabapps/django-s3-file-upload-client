import { MockPromise, MockPromiseCall } from './mock-promise';

export type MockPromiseAllFunction = (
  promises: ReadonlyArray<Promise<any>>
) => Promise<ReadonlyArray<any>>;

export interface MockPromiseAllObject {
  calls: ReadonlyArray<MockPromiseCall>;
  clear: () => void;
}

export type MockPromiseAll = MockPromiseAllFunction & MockPromiseAllObject;

const mockPromiseAllObject: MockPromiseAllObject = {
  calls: [],
  clear,
};

const mockPromiseAll = Object.assign(
  mockPromiseAllFunction as MockPromiseAllFunction,
  mockPromiseAllObject
);

function mockPromiseAllFunction(...args: any[]) {
  const call: MockPromiseCall = {
    arguments: args,
    thenCalls: [],
    catchCalls: [],
  };

  mockPromiseAll.calls = [...mockPromiseAll.calls, call];

  return new MockPromise(call);
}

function clear() {
  mockPromiseAll.calls.forEach(call => {
    call.thenCalls = [];
    call.catchCalls = [];
  });

  mockPromiseAll.calls = [];
}

export { mockPromiseAll };
