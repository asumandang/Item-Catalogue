import {
  ApplicationConfig,
  inject,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { API_V1_PREFIX, IMMUTABLE_WEB_CONFIG } from '@item-catalogue/http-core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
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
