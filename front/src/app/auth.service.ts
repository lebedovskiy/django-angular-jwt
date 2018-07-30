import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {
  }

  login(email: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/api-token-auth/`, {email: email, password: password})
      .pipe(map(user => {
        if (user && user.token) {
          // получаем токен
          localStorage.setItem('token', JSON.stringify(user.token));
          // получаем пейлоад респонса сервера с информацией юзера
          localStorage.setItem('user', JSON.stringify(user.user));
        }

        return user;
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('token');
  }
}
