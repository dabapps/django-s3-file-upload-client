import { UploadData, UploadForm, UploadFormFields } from '../../src/types';

export const mockedUploadFormFields: UploadFormFields = {
  AWSAccessKeyId: 'aaaaaa',
  key: 'file_key',
  policy: 'gygfrygsdfsdfefewgfew',
  signature: 'gsrt5yshsthshtrhtr',
};

export const mockedUploadForm: UploadForm = {
  fields: mockedUploadFormFields,
  url: 'https://llamas.s3.amazonaws.com/',
};

export const mockedUploadData: UploadData = {
  complete_url: 'https://llamas/api/s3-file-uploads/12345/complete/',
  created: '2000-01-01',
  file: 'https://llamas.s3.amazonaws.com/12345',
  file_key: 'file_key',
  file_path: '/api/s3-file-uploads/12345/',
  filename: 'llamas are cool',
  id: '12345',
  modified: '2000-01-01',
  upload_form: mockedUploadForm,
};

export const mockedFile = new File([], 'llama');
