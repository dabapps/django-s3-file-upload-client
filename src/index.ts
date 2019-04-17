import axios, { AxiosResponse } from 'axios';
import * as Cookies from 'js-cookie';
import { UploadData, UploadFormFieldsAndFile } from './types';

const POST = 'POST';

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
    })
    .catch(error => {
      return Promise.reject(error);
    });
};

export const uploadFiletoSignedUrl = (
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
    })
    .catch(error => {
      return Promise.reject(error);
    });
};

export const getUploadForm = (file: File): Promise<UploadData> => {
  return axios
    .request({
      method: POST,
      url: '/api/s3-file-uploads/',
      headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
      },
    })
    .then((uploadResponse: AxiosResponse<UploadData>) => {
      return uploadFiletoSignedUrl(uploadResponse.data, file);
    })
    .catch(error => {
      return Promise.reject(error);
    });
};

export const uploadFileToS3 = (file: File): Promise<UploadData> => {
  return getUploadForm(file);
};
