import { createReducer } from '@dabapps/redux-create-reducer';
import { INITIAL_REDUCER_STATE } from './constants';
import { ActionSet, UploadState } from './types';

export const createFileUploadReducer = (actionSet: ActionSet) =>
  createReducer<UploadState>(
    {
      [actionSet.BEGIN]: (state, action) => {
        if (window.console && state.loading) {
          // tslint:disable-next-line:no-console
          console.error(
            'New upload file action dispatched during existing upload. You should prevent uploading files during an existing upload to avoid strange loading states.'
          );
        }

        return { ...INITIAL_REDUCER_STATE, fileCount: action.payload };
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

        return {
          ...state,
          data: action.payload,
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

        return {
          ...state,
          error: action.payload,
          loading,
          inFlightCount,
          completeCount,
          failureCount,
        };
      },
    },
    INITIAL_REDUCER_STATE
  );
