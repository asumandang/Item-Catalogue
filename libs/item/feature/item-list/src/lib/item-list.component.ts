import { ItemListItemComponent } from '@item-catalogue/item-ui';
import { ItemService } from '@item-catalogue/item-data-access';
import { Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { AsyncPipe, NgFor } from '@angular/common';
import {
  exhaustMap,
  filter,
  map,
  merge,
  switchMap,
  tap,
} from 'rxjs';
import { RxIf } from '@rx-angular/template/if';
import { rxActions } from '@rx-angular/state/actions';
import { ConfirmationModalService } from '@item-catalogue/shared-service';
import { rxState } from '@rx-angular/state';
import { Item } from '@item-catalogue/dto';

@Component({
  selector: 'item-catalogue-item-list',
  standalone: true,
  imports: [MatTableModule, NgFor, RxIf, AsyncPipe, ItemListItemComponent],
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.css',
})
export class ItemListComponent {
  itemService = inject(ItemService);
  modalService = inject(ConfirmationModalService);

  private actions = rxActions<{
    deleteItem: { itemId: string };
    getItems: void;
    setItems: Item[];
  }>();

  private state = rxState<{ items: Item[] }>(({ set, connect }) => {
    set({ items: [] });
    connect(
      'items',
      merge(this.itemService.getItems(), this.actions.setItems$),
      (_state, items) => items
    );
  });
  item$ = this.state.select('items');
  hasItem$ = this.item$.pipe(map((items) => items.length > 0));

  private deleteItemEffect = this.actions.onDeleteItem((deleteItem$) =>
    deleteItem$.pipe(
      exhaustMap(({ itemId }) =>
        this.modalService
          .open({
            title: 'Item Deletion',
            message: 'Are you sure you want to delete this item?',
            actionButton: 'Delete',
          })
          .pipe(
            filter((result) => result),
            switchMap(() =>
              this.itemService
                .deleteItem(itemId)
                .pipe(tap(() => this.actions.getItems()))
            )
          )
      )
    )
  );

  private getItemEffect = this.actions.onGetItems((getItem$) =>
    getItem$.pipe(
      switchMap(() =>
        this.itemService
          .getItems()
          .pipe(tap((items) => this.actions.setItems(items)))
      )
    )
  );

  deleteItem(item: { id: string }) {
    this.actions.deleteItem({ itemId: item.id });
  }
}
