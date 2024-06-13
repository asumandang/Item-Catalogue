import {
  Injectable,
  Injector,
  inject,
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {
  CONFIRMATION_MODAL_INPUT,
  ConfirmationModalInput,
} from '@item-catalogue/dto';
import { switchMap, defer, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationModalService {
  private injector = inject(Injector);
  private modalService = inject(MatDialog);

  open(modalInput: ConfirmationModalInput, options?: MatDialogConfig) {
    return this.getModalRef(modalInput, options).pipe(
      switchMap((modalRef) => modalRef.afterClosed())
    );
  }

  getModalRef(modalInput: ConfirmationModalInput, options?: MatDialogConfig) {
    const newOptions: MatDialogConfig = {
      ...options,
      injector: Injector.create({
        parent: this.injector,
        providers: [
          {
            provide: CONFIRMATION_MODAL_INPUT,
            useValue: modalInput,
          },
        ],
      }),
    };

    return defer(
      () =>
        import(
          /* webpackChunkName: 'ic-shared-ui-confirmation-modal' */
          '@item-catalogue/shared-ui-confirmation-modal'
        )
    ).pipe(
      map(({ ConfirmationModalComponent }) =>
        this.modalService.open(ConfirmationModalComponent, newOptions)
      )
    );
  }
}
