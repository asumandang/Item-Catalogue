import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_V1_PREFIX, adminAuthToken } from '@item-catalogue/http-core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly apiV1Prefix = inject(API_V1_PREFIX);

  logIn(email: string, password: string) {
    return this.httpClient.post<string>(
      `${this.apiV1Prefix}/login`,
      { email, password },
      {
        context: adminAuthToken(),
      }
    );
  }

  logOut() {
    return this.httpClient.post(
      `${this.apiV1Prefix}/logout`,
      null,
      {
        context: adminAuthToken(),
      }
    );
  }
}
