import { mockPromiseAll } from './helpers/mock-promise-all';
jest.spyOn(Promise, 'all').mockImplementation(mockPromiseAll);
import { MockPromise } from './helpers/mock-promise';

import {
  createActionSet,
  createFileUploadAction,
  FileUploadOptions,
} from '../src';
import * as request from '../src/upload-file-to-s3';

describe('createFileUploadAction', () => {
  const ACTION_SET = createActionSet('PROFILE_PICTURE_UPLOAD');

  beforeEach(() => {
    mockPromiseAll.clear();
  });

  it('should create a thunk action creator', () => {
    const actionCreator = createFileUploadAction(ACTION_SET);

    expect(typeof actionCreator).toBe('function');

    const action = actionCreator([]);

    expect(typeof action).toBe('function');
  });

  it('should dispatch some actions, construct a request for each file, and return a promise', () => {
    jest
      .spyOn(request, 'uploadFileToS3')
      .mockImplementation(
        (file: File) =>
          new MockPromise({ arguments: [file], thenCalls: [], catchCalls: [] })
      );

    const dispatch = jest.fn();
    const files = [new File([], 'file-1.jpg'), new File([], 'file-2.jpg')];

    const actionCreator = createFileUploadAction(ACTION_SET);
    const action = actionCreator(files);

    const result = action(dispatch);

    const { calls: dispatchCalls } = dispatch.mock;

    expect(result instanceof MockPromise).toBe(true);

    expect(dispatchCalls.length).toBe(3);
    // Initially dispatch the begin action
    expect(dispatchCalls[0]).toEqual([{ type: ACTION_SET.BEGIN, payload: 2 }]);
    // Then dispatch a request action for each file
    expect(dispatchCalls[1]).toEqual([{ type: ACTION_SET.REQUEST }]);
    expect(dispatchCalls[2]).toEqual([{ type: ACTION_SET.REQUEST }]);

    const { calls: promiseAllCalls } = mockPromiseAll;

    expect(promiseAllCalls.length).toBe(1);
    // List of file promises is only argument
    expect(promiseAllCalls[0].arguments.length).toBe(1);
    // Should be 2 file promises (one for each file)
    expect(promiseAllCalls[0].arguments[0].length).toBe(2);
    // Check that the array actually contains promises
    expect(promiseAllCalls[0].arguments[0][0] instanceof MockPromise).toBe(
      true
    );
    expect(promiseAllCalls[0].arguments[0][1] instanceof MockPromise).toBe(
      true
    );
  });

  it('should rethrow if the shouldRethrow option returns true', () => {
    jest
      .spyOn(request, 'uploadFileToS3')
      .mockImplementation(
        (file: File) =>
          new MockPromise({ arguments: [file], thenCalls: [], catchCalls: [] })
      );

    const mutableOptions: FileUploadOptions = {};

    const actionCreator = createFileUploadAction(ACTION_SET, mutableOptions);
    const action = actionCreator([]);
    action(jest.fn());

    const { calls: promiseAllCalls } = mockPromiseAll;
    const { thenCalls, catchCalls } = promiseAllCalls[0];

    expect(thenCalls.length).toBe(0);
    expect(catchCalls.length).toBe(1);

    const [onlyCatchCall] = catchCalls;

    expect(onlyCatchCall.arguments.length).toBe(1);

    const [callback] = onlyCatchCall.arguments;

    expect(() => callback('an error')).not.toThrow();
    mutableOptions.shouldRethrow = () => true;
    expect(() => callback('an error')).toThrow('an error');
  });
});
