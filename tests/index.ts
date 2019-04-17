import { mockAxios } from './helpers/mock-axios';
jest.mock('axios', () => ({ default: mockAxios }));

import * as requests from '../src/index';
import { mockedFile, mockedUploadData } from './helpers/stubs';

describe('uploadFileToS3', () => {
  beforeEach(() => {
    mockAxios.clear();
  });

  describe('completeFileUpload', () => {
    it('should make an axios request and return mockedUploadData', () => {
      requests.completeFileUpload(mockedUploadData);

      // Get the request calls
      const { requestCalls } = mockAxios;

      // Check that it was called
      expect(requestCalls.length).toBe(1);

      // Get the .then calls
      const { thenCalls } = requestCalls[0];

      // Manually trigger .then
      const response = thenCalls[0].arguments[0]();
      expect(response).toEqual(mockedUploadData);
    });
  });

  describe('uploadFiletoSignedUrl', () => {
    it('should make an axios request and then call completeFileUpload', () => {
      requests.uploadFiletoSignedUrl(mockedUploadData, mockedFile);

      // Get the request calls
      const { requestCalls } = mockAxios;

      // Check that it was called
      expect(requestCalls.length).toBe(1);

      // Get the .then calls
      const { thenCalls } = requestCalls[0];

      const spyOnCompleteFileUpload = jest.spyOn(
        requests,
        'completeFileUpload'
      );

      // Manually trigger .then
      thenCalls[0].arguments[0]();
      expect(spyOnCompleteFileUpload).toHaveBeenCalledTimes(1);
      expect(spyOnCompleteFileUpload).toHaveBeenCalledWith(mockedUploadData);
    });
  });

  describe('getUploadForm', () => {
    it('should make an axios request and then call uploadFiletoSignedUrl', () => {
      requests.getUploadForm(mockedFile);

      // Get the request calls
      const { requestCalls } = mockAxios;

      // Check that it was called
      expect(requestCalls.length).toBe(1);

      // Get the .then calls
      const { thenCalls } = requestCalls[0];

      const spyOnUploadFiletoSignedUrl = jest.spyOn(
        requests,
        'uploadFiletoSignedUrl'
      );

      // Manually trigger .then
      thenCalls[0].arguments[0]({ data: mockedUploadData });
      expect(spyOnUploadFiletoSignedUrl).toHaveBeenCalledTimes(1);
      expect(spyOnUploadFiletoSignedUrl).toHaveBeenCalledWith(
        mockedUploadData,
        mockedFile
      );
    });
  });
});
