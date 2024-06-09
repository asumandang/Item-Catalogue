import { Route } from '@angular/router';
import { HomeComponent } from '@item-catalogue/home';

export const appRoutes: Route[] = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'items',
        loadChildren: () =>
          import(
            /* webpackChunkName: 'item-shell' */ '@item-catalogue/item-shell'
          ).then((m) => m.itemRoutes),
      },
    ],
  },
];
