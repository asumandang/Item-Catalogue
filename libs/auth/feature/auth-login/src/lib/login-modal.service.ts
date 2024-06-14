import { Injectable, Injector, inject } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { switchMap, defer, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginModalService {
  private injector = inject(Injector);
  private modalService = inject(MatDialog);

  open(options?: MatDialogConfig) {
    return this.getModalRef(options).pipe(
      switchMap((modalRef) => modalRef.afterClosed())
    );
  }

  getModalRef(options?: MatDialogConfig) {
    const newOptions: MatDialogConfig = {
      ...options,
      injector: Injector.create({
        parent: this.injector,
        providers: [],
      }),
    };

    return defer(
      () =>
        import(
          /* webpackChunkName: 'ic-shared-ui-login-modal' */
          '@item-catalogue/auth-login'
        )
    ).pipe(
      map(({ AuthLoginComponent }) => {
        return this.modalService.open(AuthLoginComponent, newOptions);
      })
    );
  }
}
