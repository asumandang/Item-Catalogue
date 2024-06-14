import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'item-catalogue-auth-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './auth-login.component.html',
  styleUrl: './auth-login.component.css',
})
export class AuthLoginComponent {
  readonly fb = new FormBuilder();
  readonly snackbar = inject(MatSnackBar);
  readonly dialogRef = inject(MatDialogRef<AuthLoginComponent>);
  userForm = this.fb.nonNullable.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  logIn() {
    if (this.userForm.invalid) {
      console.log(this.userForm.invalid);
      console.log(this.userForm.valid);
      console.log(this.userForm);
      this.snackbar.open('Invalid inputs!');
      return;
    }

    this.dialogRef.close({ ...this.userForm.getRawValue() });
  }
}
