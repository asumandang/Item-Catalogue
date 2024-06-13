import { createReducer, on } from '@ngrx/store';
import { userDoesNotExist, userHasAuthenticated } from './action';
import { AuthState } from './model';

const initialState: AuthState = {
  user: null,
  accessToken: '',
};

export const authReducer = createReducer(
  initialState,
  on(
    userHasAuthenticated,
    (state, action): AuthState => ({
      ...state,
      user: action.user,
      accessToken: action.accessToken,
    })
  ),
  on(
    userDoesNotExist,
    (state): AuthState => ({
      ...state,
      ...initialState,
    })
  )
);
