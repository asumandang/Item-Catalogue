import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Item } from '@item-catalogue/dto';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { userFeature } from '@item-catalogue/auth-state';
import { RxIf } from '@rx-angular/template/if';

@Component({
  selector: 'item-catalogue-item-list-item',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, RouterLink, NgOptimizedImage, RxIf],
  templateUrl: './item-list-item.component.html',
  styleUrl: './item-list-item.component.css',
})
export class ItemListItemComponent {
  @Input({ required: true }) item!: Item;

  @Output() readonly itemDelete = new EventEmitter<{ id: string }>();

  store = inject(Store);
  user$ = this.store.select(userFeature.selectUser);

  deleteItem() {
    this.itemDelete.emit({ id: this.item.id });
  }
}
