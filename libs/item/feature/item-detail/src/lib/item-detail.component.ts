import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-item-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './item-detail.component.html',
  styleUrl: './item-detail.component.css',
})
export class ItemDetailComponent {}