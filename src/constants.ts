import { UploadState } from './types';

export const POST = 'POST';

export const INITIAL_REDUCER_STATE: UploadState = {
  loading: false,
  fileCount: 0,
  inFlightCount: 0,
  completeCount: 0,
  successCount: 0,
  failureCount: 0,
  data: undefined,
  error: undefined,
};
