import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { Component, inject } from '@angular/core';
import { CONFIRMATION_MODAL_INPUT } from '@item-catalogue/dto';

@Component({
  selector: 'item-catalogue-confirmation-modal',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.css',
})
export class ConfirmationModalComponent {
  input = inject(CONFIRMATION_MODAL_INPUT);
}
