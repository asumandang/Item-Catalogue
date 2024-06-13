import { User } from '@item-catalogue/dto';
import { createAction, props } from '@ngrx/store';

export const tryToLogIn = createAction(
  '[Auth] Try to log in',
  props<{
    email: string;
    password: string;
  }>()
);
export const tryToLogOut = createAction('[Auth] Try to log out');
export const userHasAuthenticated = createAction(
  "[Cognito User] Set user's attributes",
  props<{
    user: User;
    accessToken: string;
  }>()
);
export const userDoesNotExist = createAction('[Auth] User does not exist');
export const userLogOut = createAction('[Auth] Log out user');
