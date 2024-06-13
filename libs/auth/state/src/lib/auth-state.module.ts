import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { userFeature } from './feature';
import { AuthEffect } from './auth.effects';

@NgModule({
  imports: [
    StoreModule.forFeature(userFeature),
    EffectsModule.forFeature([AuthEffect]),
  ],
})
export class AuthStateModule {}
