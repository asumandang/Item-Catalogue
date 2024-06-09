import { ItemListItemComponent } from '@item-catalogue/item-ui';
import { ItemService } from '@item-catalogue/item-data-access';
import { Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { AsyncPipe, NgFor } from '@angular/common';

@Component({
  selector: 'item-catalogue-item-list',
  standalone: true,
  imports: [MatTableModule, NgFor, AsyncPipe, ItemListItemComponent],
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.css',
})
export class ItemListComponent {
  itemService = inject(ItemService);
  item$ = this.itemService.getItems();
}
