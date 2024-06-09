import { DOCUMENT } from '@angular/common';
import { InjectionToken, inject } from '@angular/core';

export const parseConfig = <T = Record<string, any>>(
  document: Document,
  elementSelector: string
) => {
  console.log(document);
  const immutableConfig =
    document.querySelector<HTMLScriptElement>(elementSelector);
  console.log(immutableConfig);

  if (!immutableConfig) {
    throw new Error('Immutable web app config missing');
  }

  return JSON.parse(immutableConfig.textContent ?? '{}') as T;
};

export type ConfigValidatorFn = (...args: any[]) => boolean;

export const IMMUTABLE_WEB_CONFIG_VALIDATOR =
  new InjectionToken<ConfigValidatorFn>('IMMUTABLE_WEB_CONFIG_VALIDATOR');

export const IMMUTABLE_WEB_CONFIG = new InjectionToken<Record<string, any>>(
  'IMMUTABLE_WEB_CONFIG',
  {
    providedIn: 'root',
    factory() {
      const document = inject(DOCUMENT);
      console.log('document');
      console.log(document);
      const window = document.defaultView;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const env: Record<string, any> =
        window !== null && typeof (window as any)['env'] !== 'undefined'
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ((window as any)['env'] as Record<string, any>)
          : parseConfig(document, '#iwa-c');

          console.log(env);
      return env;
    },
  }
);
