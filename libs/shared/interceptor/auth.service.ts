import type { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { type Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(@Inject(API_KEY) private readonly _apiKey: string) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Add API key to request headers
    request = request.clone({
      setHeaders: {
        'X-API-Key': this._apiKey,
      },
    });
    return next.handle(request);
  }
}
