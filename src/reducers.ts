import { createReducer } from '@dabapps/redux-create-reducer';
import { AnyAction } from 'redux';
import { INITIAL_REDUCER_STATE } from './constants';
import {
  ActionSet,
  BeginAction,
  FailureAction,
  SuccessAction,
  UploadState,
} from './types';

export const begin = (state: UploadState, action: AnyAction) => {
  if (window.console && state.loading) {
    // tslint:disable-next-line:no-console
    console.error(
      'New upload file action dispatched during existing upload. You should prevent uploading files during an existing upload to avoid strange loading states.'
    );
  }

  return {
    ...INITIAL_REDUCER_STATE,
    fileCount: (action as BeginAction).payload,
  };
};

export const request = (state: UploadState) => {
  const inFlightCount = state.inFlightCount + 1;
  const loading = inFlightCount > 0;

  return { ...state, inFlightCount, loading };
};

export const success = (state: UploadState, action: AnyAction) => {
  const inFlightCount = Math.max(state.inFlightCount - 1, 0);
  const loading = inFlightCount > 0;
  const completeCount = state.completeCount + 1;
  const successCount = state.successCount + 1;
  const { data = [] } = state;

  return {
    ...state,
    data: [...data, (action as SuccessAction).payload],
    loading,
    inFlightCount,
    completeCount,
    successCount,
  };
};

const failure = (state: UploadState, action: AnyAction) => {
  const inFlightCount = Math.max(state.inFlightCount - 1, 0);
  const loading = inFlightCount > 0;
  const completeCount = state.completeCount + 1;
  const failureCount = state.failureCount + 1;
  const { error = [] } = state;

  return {
    ...state,
    error: [...error, (action as FailureAction).payload],
    loading,
    inFlightCount,
    completeCount,
    failureCount,
  };
};

export const createFileUploadReducer = (actionSet: ActionSet) =>
  createReducer<UploadState, AnyAction>(
    {
      [actionSet.BEGIN]: begin,
      [actionSet.REQUEST]: request,
      [actionSet.SUCCESS]: success,
      [actionSet.FAILURE]: failure,
    },
    INITIAL_REDUCER_STATE
  );
