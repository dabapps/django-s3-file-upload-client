import { MockPromise, MockPromiseCall } from './mock-promise';

type MockAxiosFunction = (...args: any[]) => MockPromise;

interface MockAxiosCalls {
  calls: MockPromiseCall[];
  requestCalls: MockPromiseCall[];
  getCalls: MockPromiseCall[];
  deleteCalls: MockPromiseCall[];
  headCalls: MockPromiseCall[];
  postCalls: MockPromiseCall[];
  putCalls: MockPromiseCall[];
  patchCalls: MockPromiseCall[];
}

interface MockAxiosMethods {
  clear(): void;
}

interface MockAxiosObject extends MockAxiosCalls, MockAxiosMethods {
  defaults: any;
  interceptors: {
    request: any;
    response: any;
  };
  request: MockAxiosFunction;
  get: MockAxiosFunction;
  delete: MockAxiosFunction;
  head: MockAxiosFunction;
  post: MockAxiosFunction;
  put: MockAxiosFunction;
  patch: MockAxiosFunction;
  CancelToken: {
    source(): {
      token: any;
      cancel(): void;
    };
  };
  isCancel(value: any): boolean;
}

export type MockAxios = MockAxiosFunction & MockAxiosObject;

const MATCHES_CALLS = /calls$/i;

// tslint:disable-next-line:max-classes-per-file
export class MockCancelledError extends Error {}

let mockAxiosObject: MockAxiosObject;

mockAxiosObject = {
  isCancel: (value: any) => value instanceof MockCancelledError,
  defaults: {},
  interceptors: {
    request: {},
    response: {},
  },
  request: createMockAxiosFunction('requestCalls'),
  get: createMockAxiosFunction('getCalls'),
  delete: createMockAxiosFunction('deleteCalls'),
  head: createMockAxiosFunction('headCalls'),
  post: createMockAxiosFunction('postCalls'),
  put: createMockAxiosFunction('putCalls'),
  patch: createMockAxiosFunction('patchCalls'),
  calls: [],
  requestCalls: [],
  getCalls: [],
  deleteCalls: [],
  headCalls: [],
  postCalls: [],
  putCalls: [],
  patchCalls: [],
  clear,
  CancelToken: {
    source: () => ({
      token: 'CancelToken',
      // tslint:disable-next-line:variable-name
      cancel: (_message?: string) => void 0,
    }),
  },
};

const mockAxios: MockAxios = Object.assign(
  createMockAxiosFunction('calls'),
  mockAxiosObject
);
function createMockAxiosFunction(key: keyof MockAxiosCalls) {
  return function mockAxiosFunction(...args: any[]) {
    const call: MockPromiseCall = {
      arguments: args,
      thenCalls: [],
      catchCalls: [],
    };

    mockAxios[key].push(call);
    return new MockPromise(call);
  };
}

function clear() {
  const mockAxiosKeys = Object.keys(mockAxios) as Array<keyof MockAxiosObject>;

  mockAxiosKeys.forEach(key => {
    if (MATCHES_CALLS.test(key) && Array.isArray(mockAxios[key])) {
      mockAxios[key as keyof MockAxiosCalls].forEach(call => {
        call.thenCalls = [];
        call.catchCalls = [];
      });

      mockAxios[key] = [];
    }
  });
}

export function createMockCancelledError(value: string | Error) {
  return new MockCancelledError(value instanceof Error ? value.message : value);
}

export { mockAxios };
