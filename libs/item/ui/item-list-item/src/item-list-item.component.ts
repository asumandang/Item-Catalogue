import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Item } from '@item-catalogue/dto';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'item-catalogue-item-list-item',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, RouterLink, NgOptimizedImage],
  templateUrl: './item-list-item.component.html',
  styleUrl: './item-list-item.component.css',
})
export class ItemListItemComponent {
  @Input({ required: true }) item!: Item;

  @Output() readonly itemDelete = new EventEmitter<{ id: string }>();

  deleteItem() {
    this.itemDelete.emit({ id: this.item.id });
  }
}
