import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { ActionSet, BeginAction, FailureAction, SuccessAction } from './types';
import { uploadFileToS3 } from './upload-file-to-s3';

export const uploadFileWithLoading = <S>(
  actionSet: ActionSet,
  file: File,
  dispatch: ThunkDispatch<S, unknown, AnyAction>
) => {
  dispatch({ type: actionSet.REQUEST });

  return uploadFileToS3(file)
    .then(data => {
      dispatch<SuccessAction>({ type: actionSet.SUCCESS, payload: data });
      return data;
    })
    .catch(error => {
      dispatch<FailureAction>({ type: actionSet.FAILURE, payload: error });
      throw error;
    });
};

export const createFileUploadAction = <S>(actionSet: ActionSet) => (
  files: ReadonlyArray<File>
) => (dispatch: ThunkDispatch<S, unknown, AnyAction>) => {
  const promises = files.map(file =>
    uploadFileWithLoading(actionSet, file, dispatch)
  );

  dispatch<BeginAction>({
    type: actionSet.BEGIN,
    payload: files.length,
  });

  return Promise.all(promises);
};
