import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { ActionSet } from './types';
import { uploadFileToS3 } from './upload-file-to-s3';

export const uploadFileWithLoading = <S>(
  actionSet: ActionSet,
  file: File,
  dispatch: ThunkDispatch<S, unknown, AnyAction>
) => {
  dispatch({ type: actionSet.REQUEST });

  return uploadFileToS3(file)
    .then(data => {
      dispatch({ type: actionSet.SUCCESS, payload: data });
      return data;
    })
    .catch(error => {
      dispatch({ type: actionSet.FAILURE, payload: error });
      throw error;
    });
};

export const createFileUploadAction = <S>(actionSet: ActionSet) => (
  files: File | ReadonlyArray<File>
) => (dispatch: ThunkDispatch<S, unknown, AnyAction>) => {
  const filesArray = Array.isArray(files) ? files : [files];
  const promises = filesArray.map(file =>
    uploadFileWithLoading(actionSet, file, dispatch)
  );

  dispatch({
    type: actionSet.BEGIN,
    payload: filesArray.length,
  });

  return Promise.all(promises);
};
