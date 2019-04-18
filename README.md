Django S3 File Upload Server
===================
[![Build Status](https://travis-ci.com/dabapps/django-s3-file-upload-client.svg?token=k7ApnEQbpXLoWVm5Bc9o&branch=master)](https://travis-ci.com/dabapps/django-s3-file-upload-client)

Upload files from the browser to S3 - client side implementation

For the server side implementation see [github.com/dabapps/django-s3-file-upload-server](https://github.com/dabapps/django-s3-file-upload-server)

## Getting Started

### Installation

To install the package run

    npm install --save github:dabapps/django-s3-file-upload-client


## Usage
The flow to be able to upload files from the browser straight to AWS is as follows.
![Flow S3 file uploads](images/flow-s3-file-uploads.png)

All you need to do is import and call the function `uploadFileToS3` with your file and it will chain the three requests that the frontend needs to make to upload a file from the browser to S3:
1. request upload from server
2. upload file to AWS S3
3. mark upload as complete on server

The function `uploadFileToS3` returns a `Promise` of type `Promise<UploadData>` with
```
interface UploadData {
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
```

The implementation is specific to the endpoints setup in this repo [github.com/dabapps/django-s3-file-upload-server](https://github.com/dabapps/django-s3-file-upload-server) so be sure to have the backend configured accordingly.

## Examples
Let's say we have a form which contains a `file`, which we want to upload to S3 on submit, we can do the following.
```
import { UploadData, uploadFileToS3 } from '@dabapps/django-s3-file-upload';

interface FormData = {
  file: File
}

...

private handleSubmit = (formData: FormData): Promise<UploadData> => {
  uploadFileToS3(formData.file)
};
```

The file should now be stored in `S3`, but isn't linked to any useful models (apart from `UploadedFile`) on the backend yet.

Say we have a `Llama` model on the backend and an action implemented on the frontend to `updateLlamaProfile`. We'll probably want to update the Llama profile with the new `file` after it's been stored in `S3`.

We can do this by chaining our functions.

```
import { UploadData, uploadFileToS3 } from '@dabapps/django-s3-file-upload';

import { updateLlamaProfile } from 'some/path/to/actions';

interface FormData = {
  file: File
}

...

private handleSubmit = (formData: FormData) => {
  uploadFileToS3(formData.file)
    .then({id} => {
      updateLlamaProfile({
        llama_file: id
      })
    });
};
```

## Code of conduct

For guidelines regarding the code of conduct when contributing to this repository please review [https://www.dabapps.com/open-source/code-of-conduct/](https://www.dabapps.com/open-source/code-of-conduct/)
