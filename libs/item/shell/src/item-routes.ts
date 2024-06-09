import { Route } from '@angular/router';
import { ItemListComponent } from '@item-catalogue/item-feature-list';

export const itemRoutes: Route[] = [
  {
    path: '',
    children: [
      { path: '', pathMatch: 'full', component: ItemListComponent },
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
