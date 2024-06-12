import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_V1_PREFIX, adminAuthToken } from '@item-catalogue/http-core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private readonly httpClient = inject(HttpClient);
  private readonly apiV1Prefix = inject(API_V1_PREFIX);

  uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file, file.name);
    return this.httpClient.post<{
      status: number;
      success: boolean;
      data: { link: string };
      error?: string;
    }>(`${this.apiV1Prefix}/images/upload`, formData, {
      context: adminAuthToken(),
    });
  }
}
