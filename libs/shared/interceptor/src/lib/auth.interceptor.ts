import type { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { switchMap } from 'rxjs';
import { ADMIN_AUTH_TOKEN } from '@item-catalogue/http-core';
import { Store } from '@ngrx/store';
import { userFeature } from '@item-catalogue/auth-state';

export const authInterceptor = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  if (!req.context.get(ADMIN_AUTH_TOKEN)) {
    return next(req);
  }

  const store = inject(Store);
  return store.select(userFeature.selectAccessToken).pipe(
    switchMap((accessToken) => {
      const newRequest = accessToken
        ? req.clone({
            headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
          })
        : req;
      return next(newRequest);
    })
  );
};
