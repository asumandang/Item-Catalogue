import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';

import { AuthService } from '@item-catalogue/shared-service';
import {
  tryToLogIn,
  tryToLogOut,
  userDoesNotExist,
  userHasAuthenticated,
  userLogOut,
} from './action';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class AuthEffect {
  authService = inject(AuthService);
  action$ = inject(Actions);
  snackbar = inject(MatSnackBar);
  readonly tryToLogIn$ = createEffect(() =>
    this.action$.pipe(
      ofType(tryToLogIn),
      exhaustMap((data) =>
        this.authService.logIn(data.email, data.password).pipe(
          map((result) => {
            if (result) {
              this.snackbar.open('You are now logged in');
              return userHasAuthenticated({
                user: { email: data.email },
                accessToken: result.accessToken,
              });
            }

            this.snackbar.open(
              'Error occurred while trying to log in. Please contact admin to resolve issue',
              'Dismiss',
              { duration: 4000 }
            );
            return userDoesNotExist();
          }),
          catchError((err) => {
            console.log(err);
            this.snackbar.open(
              err.error ??
                'Error occurred while trying to log in. Please contact admin to resolve issue',
              'Dismiss',
              { duration: 4000 }
            );
            return of(userDoesNotExist());
          })
        )
      )
    )
  );

  readonly signOut$ = createEffect(() => {
    return this.action$.pipe(
      ofType(tryToLogOut),
      map(() => userLogOut())
    );
  });
}
