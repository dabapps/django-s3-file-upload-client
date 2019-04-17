import {
  File,
  UploadData,
  UploadForm,
  UploadFormFields,
  UploadResponse,
} from '../../src/types';

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

export const mockedUploadResponse: UploadResponse = {
  data: mockedUploadData,
};

export const mockedFile: File = {
  lastModified: 34567,
  lastModifiedDate: new Date('2020-01-10'),
  name: 'llama_file',
  path: '/something/something/llama',
  size: 12345,
  type: 'png',
  webkitRelativePath: 'another/path',
};
