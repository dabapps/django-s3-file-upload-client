import { mockPromiseAll } from './helpers/mock-promise-all';
jest.spyOn(Promise, 'all').mockImplementation(mockPromiseAll);
import { MockPromise } from './helpers/mock-promise';

import {
  createActionSet,
  createFileUploadAction,
  FileUploadOptions,
} from '../src';
import { uploadFileWithLoading } from '../src/actions';
import * as requests from '../src/upload-file-to-s3';

describe('upload actions', () => {
  const mockUploadFileToS3 = jest
    .spyOn(requests, 'uploadFileToS3')
    .mockImplementation(
      (file: File) =>
        new MockPromise({ arguments: [file], thenCalls: [], catchCalls: [] })
    );

  beforeEach(() => {
    mockPromiseAll.clear();
    mockUploadFileToS3.mockClear();
  });

  describe('createFileUploadAction', () => {
    const ACTION_SET = createActionSet('PROFILE_PICTURE_UPLOAD');

    it('should create a thunk action creator', () => {
      const actionCreator = createFileUploadAction(ACTION_SET);

      expect(typeof actionCreator).toBe('function');

      const action = actionCreator([]);

      expect(typeof action).toBe('function');
    });

    it('should dispatch some actions, construct a request for each file, and return a promise', () => {
      const dispatch = jest.fn();
      const files = [new File([], 'file-1.jpg'), new File([], 'file-2.jpg')];

      const actionCreator = createFileUploadAction(ACTION_SET);
      const action = actionCreator(files);

      const result = action(dispatch);

      const { calls: dispatchCalls } = dispatch.mock;

      expect(result instanceof MockPromise).toBe(true);

      expect(dispatchCalls.length).toBe(3);
      // Initially dispatch the begin action
      expect(dispatchCalls[0]).toEqual([
        { type: ACTION_SET.BEGIN, payload: 2 },
      ]);
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

  describe('uploadFileWithLoading', () => {
    const ACTION_SET = createActionSet('PROFILE_PICTURE_UPLOAD');

    it('calls uploadFileToS3 and returns a promise', () => {
      const mockFile = new File([], 'file.png');

      const result = uploadFileWithLoading(
        ACTION_SET,
        mockFile,
        jest.fn()
      ) as MockPromise;

      expect(requests.uploadFileToS3).toHaveBeenCalledTimes(1);
      expect(requests.uploadFileToS3).toHaveBeenCalledWith(mockFile);
      expect(result instanceof MockPromise).toBe(true);
    });

    it('should dispatch a request and success action (when successful)', () => {
      const dispatch = jest.fn();
      const result = uploadFileWithLoading(
        ACTION_SET,
        new File([], 'file.pdf'),
        dispatch
      ) as MockPromise;

      const { thenCalls } = result.call;

      expect(thenCalls.length).toBe(1);
      expect(thenCalls[0].arguments.length).toBe(1);

      const [thenCallback] = thenCalls[0].arguments;

      thenCallback('response data');

      const { calls: dispatchCalls } = dispatch.mock;

      expect(dispatchCalls.length).toBe(2);

      expect(dispatchCalls[0]).toEqual([{ type: ACTION_SET.REQUEST }]);

      expect(dispatchCalls[1]).toEqual([
        { type: ACTION_SET.SUCCESS, payload: 'response data' },
      ]);
    });

    it('should throw, and dispatch a request and failure action (when unsuccessful)', () => {
      const dispatch = jest.fn();
      const result = uploadFileWithLoading(
        ACTION_SET,
        new File([], 'file.pdf'),
        dispatch
      ) as MockPromise;

      const { catchCalls } = result.call;

      expect(catchCalls.length).toBe(1);
      expect(catchCalls[0].arguments.length).toBe(1);

      const [catchCallback] = catchCalls[0].arguments;

      expect(() => catchCallback('some error')).toThrow('some error');

      const { calls: dispatchCalls } = dispatch.mock;

      expect(dispatchCalls.length).toBe(2);

      expect(dispatchCalls[0]).toEqual([{ type: ACTION_SET.REQUEST }]);

      expect(dispatchCalls[1]).toEqual([
        { type: ACTION_SET.FAILURE, payload: 'some error' },
      ]);
    });
  });
});
