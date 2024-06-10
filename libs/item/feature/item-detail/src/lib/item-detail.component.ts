import { RxLet } from '@rx-angular/template/let';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ItemService } from '@item-catalogue/item-data-access';
import { map, switchMap } from 'rxjs';
import { AsyncPipe, NgIf, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'item-catalogue-item-detail',
  standalone: true,
  imports: [RouterLink, RxLet, NgIf, AsyncPipe, NgOptimizedImage],
  templateUrl: './item-detail.component.html',
  styleUrl: './item-detail.component.css',
})
export class ItemDetailComponent {
  itemService = inject(ItemService);
  route = inject(ActivatedRoute);

  slug$ = this.route.params.pipe(map((params) => params['slug']));
  item$ = this.slug$.pipe(switchMap((slug) => this.itemService.getItem(slug)));
}
