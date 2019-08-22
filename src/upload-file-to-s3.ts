import axios, { AxiosResponse } from 'axios';
import * as Cookies from 'js-cookie';
import { POST } from './constants';
import { FileAndACL, UploadData, UploadFormFieldsAndFile } from './types';

export const configureFormData = (data: UploadFormFieldsAndFile) => {
  const formData = new FormData();
  (Object.keys(data) as ReadonlyArray<keyof UploadFormFieldsAndFile>).forEach(
    key => {
      formData.append(key, data[key]);
    }
  );

  return formData;
};

export const completeFileUpload = (data: UploadData): Promise<UploadData> => {
  return axios
    .request({
      method: POST,
      url: data.complete_url,
      headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
      },
    })
    .then(() => {
      return data;
    });
};

export const uploadFileToSignedUrl = (
  uploadData: UploadData,
  file: File
): Promise<UploadData> => {
  const uploadForm = uploadData.upload_form;
  const data = {
    ...uploadForm.fields,
    file,
  };
  return axios
    .request({
      method: POST,
      url: uploadForm.url,
      data: configureFormData(data),
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(() => {
      return completeFileUpload(uploadData);
    });
};

const isFile = (file: File | FileAndACL): file is File =>
  file && !('acl' in file);

export const getUploadForm = (file: File | FileAndACL): Promise<UploadData> => {
  const data = isFile(file)
    ? {
        filename: file.name,
      }
    : {
        acl: file.acl,
        filename: file.file.name,
      };

  return axios
    .request({
      method: POST,
      url: '/api/s3-file-uploads/',
      headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
      },
      data,
    })
    .then((uploadResponse: AxiosResponse<UploadData>) => {
      return uploadFileToSignedUrl(
        uploadResponse.data,
        isFile(file) ? file : file.file
      );
    });
};

export const uploadFileToS3 = (
  file: File | FileAndACL
): Promise<UploadData> => {
  return getUploadForm(file);
};
