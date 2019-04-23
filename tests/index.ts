import { mockAxios } from './helpers/mock-axios';
jest.mock('axios', () => ({ default: mockAxios }));

import * as uploadFileToS3 from '../src/upload-file-to-s3';
import { mockedFile, mockedUploadData } from './helpers/stubs';

describe('Django S3 File Upload', () => {
  beforeEach(() => {
    mockAxios.clear();
  });

  describe('uploadFileToS3', () => {
    it('should call getUploadForm with the provided file', () => {
      jest.spyOn(uploadFileToS3, 'getUploadForm');

      uploadFileToS3.uploadFileToS3(mockedFile);

      expect(uploadFileToS3.getUploadForm).toHaveBeenCalledTimes(1);
      expect(uploadFileToS3.getUploadForm).toHaveBeenCalledWith(mockedFile);
    });
  });

  describe('getUploadForm', () => {
    it('should make an axios request and then call uploadFileToSignedUrl', () => {
      uploadFileToS3.getUploadForm(mockedFile);

      // Get the request calls
      const { requestCalls } = mockAxios;

      // Check that it was called
      expect(requestCalls.length).toBe(1);

      // Get the .then calls
      const { thenCalls } = requestCalls[0];

      const spyOnUploadFileToSignedUrl = jest.spyOn(
        uploadFileToS3,
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
  });

  describe('uploadFileToSignedUrl', () => {
    it('should make an axios request and then call completeFileUpload', () => {
      uploadFileToS3.uploadFileToSignedUrl(mockedUploadData, mockedFile);

      // Get the request calls
      const { requestCalls } = mockAxios;

      // Check that it was called
      expect(requestCalls.length).toBe(1);

      // Get the .then calls
      const { thenCalls } = requestCalls[0];

      const spyOnCompleteFileUpload = jest.spyOn(
        uploadFileToS3,
        'completeFileUpload'
      );

      // Manually trigger .then
      thenCalls[0].arguments[0]();
      expect(spyOnCompleteFileUpload).toHaveBeenCalledTimes(1);
      expect(spyOnCompleteFileUpload).toHaveBeenCalledWith(mockedUploadData);
    });
  });

  describe('completeFileUpload', () => {
    it('should make an axios request and return mockedUploadData', () => {
      uploadFileToS3.completeFileUpload(mockedUploadData);

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
});
