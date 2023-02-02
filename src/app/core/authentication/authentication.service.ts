import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, EMPTY, map } from 'rxjs';

import { Session } from '@app/models';
import { environment } from '@env/environment';
interface LoginResponse extends Session {
  success: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<Session | undefined> {
    return this.http
      .post<LoginResponse>(`${environment.dataService}/login`, {
        username: email,
        password,
      })
      .pipe(
        map((res: LoginResponse) => {
          const { success, ...session } = res;
          if (success) {
            return session;
          }
          return undefined;
        })
      );
  }

  logout(): Observable<any> {
    return this.http.post(`${environment.dataService}/logout`, {});
  }
}
