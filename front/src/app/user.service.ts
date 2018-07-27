import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { environment } from '../environments/environment';
import { User } from './user';

@Injectable()
export class UserService {
  user: User;

  constructor(private http: HttpClient) {
  }

  getById(id: number) {
    return this.http.get(`${environment.apiUrl}/user/` + id);
  }

  register(user: User) {
    return this.http.post(`${environment.apiUrl}/api-register-user/`, user);
  }

  update(id: number, user: User) {
    return this.http.put(`${environment.apiUrl}/user/` + id, user);
  }

  delete(id: number) {
    return this.http.delete(`${environment.apiUrl}/user/` + id);
  }
}
