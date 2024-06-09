import { Route } from '@angular/router';
import { ItemDetailComponent } from '@item-catalogue/feature-item-detail';

export const itemRoutes: Route[] = [
  {
    path: '',
    children: [{ path: ':id', component: ItemDetailComponent }],
  },
];
