import axios, { AxiosResponse } from 'axios';
import * as Cookies from 'js-cookie';
import { File, UploadData, UploadResponse } from '../types/index';

const POST = 'POST';

export const configureFormData = (data: any) => {
  const formData = new FormData();
  Object.keys(data).forEach((key: string) => {
    formData.append(key, data[key]);
  });

  return formData;
};

export const completeFileUpload = (
  data: UploadData
): Promise<UploadData | AxiosResponse<any>> => {
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
    .catch((error: AxiosResponse) => {
      return Promise.reject(error);
    });
};

export const uploadFiletoSignedUrl = (
  uploadResponse: UploadResponse,
  file: File
): Promise<UploadData | AxiosResponse<any>> => {
  const uploadForm = uploadResponse.data.upload_form;
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
      return completeFileUpload(uploadResponse.data);
    })
    .catch((error: AxiosResponse) => {
      return Promise.reject(error);
    });
};

export const getUploadForm = (
  file: File
): Promise<UploadData | AxiosResponse<any>> => {
  return axios
    .request({
      method: POST,
      url: '/api/s3-file-uploads/',
      headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
      },
    })
    .then((uploadResponse: AxiosResponse) => {
      return uploadFiletoSignedUrl(uploadResponse, file);
    })
    .catch((error: AxiosResponse) => {
      return Promise.reject(error);
    });
};

export const uploadFileToS3 = (
  file: File
): Promise<UploadData | AxiosResponse<any>> => {
  return getUploadForm(file);
};
