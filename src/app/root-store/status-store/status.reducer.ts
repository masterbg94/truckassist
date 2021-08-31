export const enum LoadingState {
  INIT = 'INIT',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
}

export interface ErrorState {
  error: any;
}

export type StatusState = LoadingState | ErrorState;

export function getError(statusState: StatusState): any | null {
  if ((statusState as ErrorState).error) {
    return (statusState as ErrorState).error;
  }
}
