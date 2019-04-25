import { createActionSet } from '../src';

describe('createActionSet', () => {
  it('should create an object with begin, request, success, and failure keys (symbols)', () => {
    const ACTION_SET = createActionSet('PROFILE_PICTURE_UPLOAD');
    const keys = Object.keys(ACTION_SET) as ReadonlyArray<
      keyof typeof ACTION_SET
    >;
    const expectedValues: Record<keyof typeof ACTION_SET, string> = {
      BEGIN: 'Symbol(PROFILE_PICTURE_UPLOAD_BEGIN)',
      REQUEST: 'Symbol(PROFILE_PICTURE_UPLOAD_REQUEST)',
      SUCCESS: 'Symbol(PROFILE_PICTURE_UPLOAD_SUCCESS)',
      FAILURE: 'Symbol(PROFILE_PICTURE_UPLOAD_FAILURE)',
    };

    expect(typeof ACTION_SET).toBe('object');
    expect(keys).toEqual(['BEGIN', 'REQUEST', 'SUCCESS', 'FAILURE']);

    keys.forEach(key => {
      expect(typeof ACTION_SET[key]).toBe('symbol');
      expect(ACTION_SET[key].toString()).toBe(expectedValues[key]);
    });
  });
});
