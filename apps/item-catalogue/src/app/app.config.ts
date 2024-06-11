import {
  ApplicationConfig,
  inject,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  CONFIG,
  API_V1_PREFIX,
  IMMUTABLE_WEB_CONFIG,
} from '@item-catalogue/http-core';
import { Configuration } from '@item-catalogue/dto';
import { authInterceptor } from '@item-catalogue/shared-interceptor';
import { catchError, of } from 'rxjs';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: CONFIG,
      useFactory: () => {
        const httpClient = inject(HttpClient);
        return httpClient
          .get<Configuration>('/assets/config.json')
          .pipe(catchError(() => of({ apiKey: '' })));
      },
    },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(appRoutes),
    provideAnimationsAsync(),
    {
      provide: API_V1_PREFIX,
      useFactory: () => {
        const config = inject<{ apiV1Prefix: string }>(IMMUTABLE_WEB_CONFIG);

        return config.apiV1Prefix;
      },
    },
  ],
};
