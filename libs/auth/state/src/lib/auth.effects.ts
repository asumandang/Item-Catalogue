import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map } from 'rxjs';

import { AuthService } from '@item-catalogue/shared-service';
import {
  tryToLogIn,
  tryToLogOut,
  userDoesNotExist,
  userHasAuthenticated,
  userLogOut,
} from './action';

@Injectable()
export class AuthEffect {
  authService = inject(AuthService);
  action$ = inject(Actions);
  readonly tryToLogIn$ = createEffect(() =>
    this.action$.pipe(
      ofType(tryToLogIn),
      exhaustMap((data) =>
        this.authService.logIn(data.email, data.password).pipe(
          map((result) =>
            result
              ? userHasAuthenticated({
                  user: { email: data.email },
                  accessToken: result.accessToken,
                })
              : userDoesNotExist()
          )
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
