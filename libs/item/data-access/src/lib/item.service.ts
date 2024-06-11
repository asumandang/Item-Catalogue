import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_V1_PREFIX, adminAuthToken } from '@item-catalogue/http-core';
import { Item, ItemCreateInput } from '@item-catalogue/dto';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  httpClient = inject(HttpClient);
  apiV1Prefix = inject(API_V1_PREFIX);

  getItem(slug: string) {
    return this.httpClient.get<Item>(`${this.apiV1Prefix}/items/${slug}`, {
      context: adminAuthToken(),
    });
  }

  getItems() {
    return this.httpClient.get<Item[]>(`${this.apiV1Prefix}/items`);
  }

  createItem(item: ItemCreateInput) {
    return this.httpClient.post<Item>(
      `${this.apiV1Prefix}/items`,
      { item },
      {
        context: adminAuthToken(),
      }
    );
  }
}
