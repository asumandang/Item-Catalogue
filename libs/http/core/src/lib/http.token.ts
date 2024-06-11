import { HttpContext, HttpContextToken } from '@angular/common/http';
import { InjectionToken } from '@angular/core';
import { Configuration } from '@item-catalogue/dto';
import { Observable } from 'rxjs';

export const API_V1_PREFIX = new InjectionToken<string>('ApiV1Prefix');
export const CONFIG = new InjectionToken<Observable<Configuration>>('Config');
export const ADMIN_AUTH_TOKEN = new HttpContextToken<boolean>(() => false);

export const adminAuthToken = (context = new HttpContext()) =>
  context.set(ADMIN_AUTH_TOKEN, true);
