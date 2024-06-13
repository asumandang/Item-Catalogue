import { createFeature } from '@ngrx/store';
import { authReducer } from './reducer';

export const userFeature = createFeature({
  name: 'user',
  reducer: authReducer,
});
