import { Component, Input } from '@angular/core';
import { Item } from '@item-catalogue/dto';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'item-catalogue-item-list-item',
  standalone: true,
  imports: [MatCardModule, RouterLink],
  templateUrl: './item-list-item.component.html',
  styleUrl: './item-list-item.component.css',
})
export class ItemListItemComponent {
  @Input({ required: true }) item!: Item;
}
