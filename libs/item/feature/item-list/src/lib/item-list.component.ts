import { ItemService } from './../../../../data-access/src/lib/item.service';
import { Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'item-catalogue-item-list',
  standalone: true,
  imports: [MatTableModule],
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.css',
})
export class ItemListComponent {
  itemService = inject(ItemService);
}
