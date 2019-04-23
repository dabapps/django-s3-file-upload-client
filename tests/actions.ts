import { createActionSet, createFileUploadAction } from '../src';

describe('createFileUploadAction', () => {
  const ACTION_SET = createActionSet('PROFILE_PICTURE_UPLOAD');

  it('should create a thunk action creator', () => {
    const actionCreator = createFileUploadAction(ACTION_SET);

    expect(typeof actionCreator).toBe('function');

    const action = actionCreator([]);

    expect(typeof action).toBe('function');
  });
});
