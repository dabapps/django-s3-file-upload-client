import { mockAxios } from './helpers/mock-axios';
jest.mock('axios', () => ({ default: mockAxios }));

import * as requests from '../src/index';
import { mockedFile, mockedUploadData } from './helpers/stubs';

describe('uploadFileToS3', () => {
  beforeEach(() => {
    mockAxios.clear();
  });

  describe('uploadFileToS3', () => {
    it('should call getUploadForm with the provided file', () => {
      jest.spyOn(requests, 'getUploadForm');

      requests.uploadFileToS3(mockedFile);

      expect(requests.getUploadForm).toHaveBeenCalledTimes(1);
      expect(requests.getUploadForm).toHaveBeenCalledWith(mockedFile);
    });
  });

  describe('getUploadForm', () => {
    it('should make an axios request and then call uploadFileToSignedUrl', () => {
      requests.getUploadForm(mockedFile);

      // Get the request calls
      const { requestCalls } = mockAxios;

      // Check that it was called
      expect(requestCalls.length).toBe(1);

      // Get the .then calls
      const { thenCalls } = requestCalls[0];

      const spyOnUploadFileToSignedUrl = jest.spyOn(
        requests,
        'uploadFileToSignedUrl'
      );

      // Manually trigger .then
      thenCalls[0].arguments[0]({ data: mockedUploadData });
      expect(spyOnUploadFileToSignedUrl).toHaveBeenCalledTimes(1);
      expect(spyOnUploadFileToSignedUrl).toHaveBeenCalledWith(
        mockedUploadData,
        mockedFile
      );
    });

    it('should make an axios request and catch errors', () => {
      requests.getUploadForm(mockedFile);

      // Get the request calls
      const { requestCalls } = mockAxios;

      // Check that it was called
      expect(requestCalls.length).toBe(1);

      // Get the .catch calls
      const { catchCalls } = requestCalls[0];

      // Manually trigger .catch
      catchCalls[0].arguments[0]('error');
    });
  });

  describe('uploadFileToSignedUrl', () => {
    it('should make an axios request and then call completeFileUpload', () => {
      requests.uploadFileToSignedUrl(mockedUploadData, mockedFile);

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

    it('should make an axios request and catch errors', () => {
      requests.getUploadForm(mockedFile);

      // Get the request calls
      const { requestCalls } = mockAxios;

      // Check that it was called
      expect(requestCalls.length).toBe(1);

      // Get the .catch calls
      const { catchCalls } = requestCalls[0];

      // Manually trigger .catch
      catchCalls[0].arguments[0]('error');
    });
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

    it('should make an axios request and catch errors', () => {
      requests.getUploadForm(mockedFile);

      // Get the request calls
      const { requestCalls } = mockAxios;

      // Check that it was called
      expect(requestCalls.length).toBe(1);

      // Get the .catch calls
      const { catchCalls } = requestCalls[0];

      // Manually trigger .catch
      catchCalls[0].arguments[0]('error');
    });
  });
});
