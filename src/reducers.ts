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

export const createFileUploadReducer = (actionSet: ActionSet) =>
  createReducer<UploadState, AnyAction>(
    {
      [actionSet.BEGIN]: (state, action) => {
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
      },
      [actionSet.REQUEST]: state => {
        const inFlightCount = state.inFlightCount + 1;
        const loading = inFlightCount > 0;

        return { ...state, inFlightCount, loading };
      },
      [actionSet.SUCCESS]: (state, action) => {
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
      },
      [actionSet.FAILURE]: (state, action) => {
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
      },
    },
    INITIAL_REDUCER_STATE
  );
