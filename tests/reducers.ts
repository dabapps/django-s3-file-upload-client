import { createActionSet, createFileUploadReducer, UploadState } from '../src';
import { INITIAL_REDUCER_STATE } from '../src/constants';
import { begin, failure, request, success } from '../src/reducers';

describe('createFileUploadReducer', () => {
  const ACTION_SET = createActionSet('PROFILE_PICTURE_UPLOAD');

  it('should create a reducer function', () => {
    const reducer = createFileUploadReducer(ACTION_SET);

    expect(typeof reducer).toBe('function');
  });

  describe('begin', () => {
    it('should reset the state and store the number of files', () => {
      const state: UploadState = {
        loading: false,
        fileCount: 2,
        inFlightCount: 1,
        completeCount: 1,
        successCount: 0,
        failureCount: 1,
        error: ['nope'],
        data: undefined,
      };

      const result = begin(state, { type: ACTION_SET.BEGIN, payload: 3 });

      expect(result).toEqual({
        ...INITIAL_REDUCER_STATE,
        fileCount: 3,
      });
    });
  });

  describe('request', () => {
    it('should increment the inFlightCount and set loading to true', () => {
      const state: UploadState = {
        loading: false,
        fileCount: 2,
        inFlightCount: 0,
        completeCount: 0,
        successCount: 0,
        failureCount: 0,
        error: undefined,
        data: undefined,
      };

      const result = request(state);

      expect(result).toEqual({
        ...state,
        loading: true,
        inFlightCount: 1,
      });
    });
  });

  describe('success', () => {
    it('should decrement the inFlightCount, set loading to false, increment the complete and success counts, and store the result', () => {
      const state: UploadState = {
        loading: true,
        fileCount: 2,
        inFlightCount: 1,
        completeCount: 1,
        successCount: 0,
        failureCount: 1,
        error: ['first file' as any],
        data: undefined,
      };

      const result = success(state, {
        type: ACTION_SET.SUCCESS,
        payload: 'second file',
      });

      expect(result).toEqual({
        ...state,
        loading: false,
        inFlightCount: 0,
        completeCount: 2,
        successCount: 1,
        data: ['second file'],
      });
    });
  });

  describe('failure', () => {
    it('should decrement the inFlightCount, set loading to false, increment the complete and failure counts, and store the error', () => {
      const state: UploadState = {
        loading: true,
        fileCount: 2,
        inFlightCount: 1,
        completeCount: 1,
        successCount: 1,
        failureCount: 0,
        error: undefined,
        data: ['first file' as any],
      };

      const result = failure(state, {
        type: ACTION_SET.SUCCESS,
        payload: 'second file',
      });

      expect(result).toEqual({
        ...state,
        loading: false,
        inFlightCount: 0,
        completeCount: 2,
        failureCount: 1,
        error: ['second file'],
      });
    });
  });
});
