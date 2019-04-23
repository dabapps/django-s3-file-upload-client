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

export interface UploadFormFieldsAndFile extends UploadFormFields {
  file: File;
}

export interface ActionSet {
  readonly BEGIN: symbol;
  readonly REQUEST: symbol;
  readonly SUCCESS: symbol;
  readonly FAILURE: symbol;
}
