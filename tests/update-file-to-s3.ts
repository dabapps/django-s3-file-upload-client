import { uploadFileToS3 } from '../src';
import * as requests from '../src/upload-file-to-s3';
import mockAxios from './__mocks__/axios';
import {
  mockedFile,
  mockedFileAndACL,
  mockedUploadData,
} from './helpers/stubs';

jest.mock('axios');

describe('Django S3 File Upload', () => {
  beforeEach(() => {
    mockAxios.clear();
  });

  describe('uploadFileToS3', () => {
    it('should call getUploadForm with the provided file', () => {
      jest.spyOn(requests, 'getUploadForm');

      uploadFileToS3(mockedFile);

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

      expect(requestCalls[0].arguments).toEqual([
        {
          method: 'POST',
          url: '/api/s3-file-uploads/',
          headers: {
            'X-CSRFToken': undefined,
          },
          data: {
            filename: 'llama',
          },
        },
      ]);

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

      spyOnUploadFileToSignedUrl.mockRestore();
    });
    it('should make an axios request and then call uploadFileToSignedUrl with ACL data included', () => {
      requests.getUploadForm(mockedFileAndACL);
      // Get the request calls
      const { requestCalls } = mockAxios;

      // Check that it was called
      expect(requestCalls.length).toBe(1);

      expect(requestCalls[0].arguments).toEqual([
        {
          method: 'POST',
          url: '/api/s3-file-uploads/',
          headers: {
            'X-CSRFToken': undefined,
          },
          data: {
            filename: 'drama',
            acl: 'public-read',
          },
        },
      ]);

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
        mockedFileAndACL.file
      );

      spyOnUploadFileToSignedUrl.mockRestore();
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
});
