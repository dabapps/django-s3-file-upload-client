export interface UploadFormFields {
  AWSAccessKeyId: string;
  key: string;
  policy: string;
  signature: string;
}

export interface UploadForm {
  url: string;
  fields: UploadFormFields;
}

export interface UploadData {
  id: string;
  created: string;
  modified: string;
  complete_url: string;
  file: string;
  file_key: string;
  file_path: string;
  filename: string;
  upload_form: UploadForm;
}

export interface UploadResponse {
  data: UploadData;
}

export interface File {
  lastModified: number;
  lastModifiedDate: Date;
  name: string;
  path: string;
  size: number;
  type: string;
  webkitRelativePath: string;
}
