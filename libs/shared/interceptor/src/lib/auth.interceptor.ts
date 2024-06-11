import type { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import {
  catchError,
  distinctUntilChanged,
  startWith,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { ADMIN_AUTH_TOKEN, CONFIG } from '@item-catalogue/http-core';

export const authInterceptor = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  if (!req.context.has(ADMIN_AUTH_TOKEN)) {
    return next(req);
  }

  console.log('authInterceptor', req.url);
  const config = inject(CONFIG);
  if (!config) {
    return next(req);
  }
  return config.pipe(
    take(1),
    tap((x) => console.log('pipe', x)),
    distinctUntilChanged((prev, cur) => prev.apiKey === cur.apiKey),
    tap((x) => console.log('pipe2', x)),
    startWith({ apiKey: '' }),
    switchMap((config) => {
      console.log(config);
      req = req.clone({
        setHeaders: {
          'X-API-Key': config.apiKey,
        },
      });
      return next(req);
    }),
    catchError(() => {
      console.log('error');
      return next(req);
    })
  );
};
