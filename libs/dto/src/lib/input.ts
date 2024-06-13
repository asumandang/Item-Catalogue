import { InjectionToken } from '@angular/core';

export interface ConfirmationModalInput {
  title: string;
  message: string;
  actionButton?: string;
}

export const CONFIRMATION_MODAL_INPUT =
  new InjectionToken<ConfirmationModalInput>('ConfirmationModalInput');
