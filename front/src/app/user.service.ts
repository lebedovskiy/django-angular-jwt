import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {environment} from '../environments/environment';
import {User} from './user';

@Injectable()
export class UserService {
  user: User;
  // добавляем токен авторизации
  token = localStorage.getItem('token');
  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': 'JWT' + ' ' + this.token.slice(1, this.token.length - 1)
    })
  };

  constructor(private http: HttpClient) {
  }

  getById(id: number) {
    return this.http.get(`${environment.apiUrl}/user/` + id, this.httpOptions);
  }

  register(user: User) {
    return this.http.post(`${environment.apiUrl}/api-register-user/`, user);
  }

  update(id: number, user: User) {
    return this.http.put(`${environment.apiUrl}/user/` + id, user, this.httpOptions);
  }

  delete(id: number) {
    return this.http.delete(`${environment.apiUrl}/user/` + id, this.httpOptions);
  }
}
