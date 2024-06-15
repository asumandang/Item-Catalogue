import { inject } from '@angular/core';
import { userFeature } from './../../../auth/state/src/lib/feature';
import { Route, Router } from '@angular/router';
import { ItemListComponent } from '@item-catalogue/item-feature-list';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

export const itemRoutes: Route[] = [
  {
    path: '',
    children: [
      { path: '', pathMatch: 'full', component: ItemListComponent },
      {
        path: 'create',
        canActivate: [
          () => {
            const store = inject(Store);
            const router = inject(Router);
            const snackbar = inject(MatSnackBar);
            return store.select(userFeature.selectUser).pipe(
              map((user) => {
                if (user) {
                  return true;
                }

                snackbar.open('You are not authorized to open this page');
                return router.parseUrl('/items');
              })
            );
          },
        ],
        loadComponent: () =>
          import('@item-catalogue/item-feature-create').then(
            (m) => m.ItemCreateComponent
          ),
      },
      {
        path: ':slug',
        loadComponent: () =>
          import('@item-catalogue/item-feature-detail').then(
            (m) => m.ItemDetailComponent
          ),
      },
    ],
  },
];
