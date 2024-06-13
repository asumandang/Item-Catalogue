import { ItemService } from '@item-catalogue/item-data-access';
import { ImageService } from '@item-catalogue/shared-service';
import { NgFor, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { categories } from '@item-catalogue/enum';
import { RxPush } from '@rx-angular/template/push';
import {
  EMPTY,
  Observable,
  catchError,
  exhaustMap,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { rxState } from '@rx-angular/state';
import { rxActions } from '@rx-angular/state/actions';
import { MatButtonModule } from '@angular/material/button';
import { ItemCreateInput } from '@item-catalogue/dto';
import { Router } from '@angular/router';

@Component({
  selector: 'item-catalogue-item-create',
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
  imageService = inject(ImageService);
  router = inject(Router);

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
  imageSource$: Observable<string> = this.state
    .select('imageFile')
    .pipe(
      switchMap((imageFile) =>
        imageFile
          ? this.getImageSource(imageFile)
          : of('assets/images/placeholder.png')
      )
    );
  private actions = rxActions<{
    createItem: {
      item: Omit<ItemCreateInput, 'imageUrl'>;
      imageFile: File;
    };
  }>();

  private createItemEffect = this.actions.onCreateItem(
    (createItem$) =>
      createItem$.pipe(
        exhaustMap(({ imageFile, item }) =>
          this.imageService.uploadImage(imageFile).pipe(
            tap(() => console.log('------- uploadImage')),
            switchMap((result) => {
              if (!result.success) {
                throw new Error(
                  result.error ?? 'Error occurred while uploading image'
                );
              }

              return this.itemService
                .createItem({
                  ...item,
                  imageUrl: result.data.link,
                })
                .pipe(tap(() => console.log('here')));
            }),
            catchError((err: unknown) => {
              console.log('err');
              console.log(err);
              this.snackBar.open(
                typeof err === 'string' ? err : 'Unable to create item'
              );
              return EMPTY;
            }),
            tap(() => console.log('here3'))
          )
        )
      ),
    () => {
      this.snackBar.open('Successfully created item!');
      this.router.navigateByUrl('/items');
    }
  );

  onSelectFile(event: Event) {
    if (event.target instanceof HTMLInputElement && event.target?.files?.[0]) {
      const file = event.target.files[0] as File;
      this.state.set('imageFile', () => file);
    }
  }

  createItem() {
    if (this.itemForm.invalid || !this.state.get('imageFile')) {
      this.snackBar.open('Please input required forms');
    }

    const imageFile = this.state.get('imageFile') as File;
    this.actions.createItem({
      item: this.itemForm.getRawValue(),
      imageFile,
    });
  }
}
