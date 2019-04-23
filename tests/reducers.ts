import { createActionSet, createFileUploadReducer } from '../src';
import { INITIAL_REDUCER_STATE } from '../src/constants';
import { begin } from '../src/reducers';

describe('createFileUploadReducer', () => {
  const ACTION_SET = createActionSet('PROFILE_PICTURE_UPLOAD');

  it('should create a reducer function', () => {
    const reducer = createFileUploadReducer(ACTION_SET);

    expect(typeof reducer).toBe('function');
  });

  describe('begin', () => {
    it('should reset the state and store the number of files', () => {
      const result = begin(
        {
          loading: false,
          fileCount: 2,
          inFlightCount: 1,
          completeCount: 1,
          successCount: 0,
          failureCount: 1,
          error: ['nope'],
          data: undefined,
        },
        { type: ACTION_SET.BEGIN, payload: 3 }
      );

      expect(result).toEqual({
        ...INITIAL_REDUCER_STATE,
        fileCount: 3,
      });
    });
  });
});
