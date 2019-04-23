import { ActionSet } from './types';

export const createActionSet = (name: string): ActionSet => ({
  BEGIN: Symbol(`${name}_BEGIN`),
  REQUEST: Symbol(`${name}_REQUEST`),
  SUCCESS: Symbol(`${name}_SUCCESS`),
  FAILURE: Symbol(`${name}_FAILURE`),
});
