import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_V1_PREFIX } from '@item-catalogue/http-core';
import { Item } from '@item-catalogue/dto';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  httpClient = inject(HttpClient);
  apiV1Prefix = inject(API_V1_PREFIX);

  getItems() {
    return this.httpClient.get<Item[]>(`${this.apiV1Prefix}/items`);
  }
}
