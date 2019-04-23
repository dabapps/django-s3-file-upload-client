import { createActionSet, createFileUploadReducer } from '../src';

describe('createFileUploadReducer', () => {
  const ACTION_SET = createActionSet('PROFILE_PICTURE_UPLOAD');

  it('should create a reducer function', () => {
    const reducer = createFileUploadReducer(ACTION_SET);

    expect(typeof reducer).toBe('function');
  });
});
