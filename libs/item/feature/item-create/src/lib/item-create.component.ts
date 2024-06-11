import { ItemService } from '@item-catalogue/item-data-access';
import { NgFor, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { categories } from '@item-catalogue/enum';
import { RxPush } from '@rx-angular/template/push';
import { Observable, of, switchMap, tap } from 'rxjs';
import { rxState } from '@rx-angular/state';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'lib-item-create',
  standalone: true,
  imports: [
    NgFor,
    NgOptimizedImage,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    RxPush,
  ],
  templateUrl: './item-create.component.html',
  styleUrl: './item-create.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemCreateComponent {
  categories = categories;
  fb = new FormBuilder();
  itemForm = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
    category: ['', [Validators.required]],
    slug: ['', [Validators.required]],
  });
  imageFile: File | null = null;
  snackBar = inject(MatSnackBar);
  itemService = inject(ItemService);

  getImageSource(file: File): Observable<string> {
    const placeholder = 'assets/images/placeholder.png';
    return new Observable((observer) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        const image = new Image();

        if (!event.target?.result) {
          observer.next(placeholder);
          observer.complete();
          return;
        }

        image.src = event.target.result.toString();
        image.onload = function () {
          observer.next(image.src);
          observer.complete();
        };

        image.onerror = (err) => {
          observer.error(err);
        };
      };

      reader.onerror = (error) => {
        observer.error(error);
      };
    });
  }

  private state = rxState<{ imageFile: File | null }>(({ set }) => {
    // set initial state
    set({ imageFile: null });
  });
  imageFile$ = this.state.select('imageFile');
  imageSource$: Observable<string> = this.imageFile$.pipe(
    switchMap((imageFile) =>
      imageFile
        ? this.getImageSource(imageFile)
        : of('assets/images/placeholder.png')
    )
  );

  onSelectFile(event: Event) {
    if (event.target instanceof HTMLInputElement && event.target?.files?.[0]) {
      const file = event.target.files[0] as File;
      this.state.set('imageFile', () => file);
    }
  }

  createItem() {
    if (this.itemForm.invalid || this.imageFile === null) {
      this.snackBar.open('Please input required forms');
    }

    this.itemService.createItem({
      ...this.itemForm.getRawValue(),
      imageUrl: '',
    });
  }
}
