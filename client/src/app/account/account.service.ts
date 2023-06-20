import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IAddress, IUser } from '../shared/models/user';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSource = new ReplaySubject<IUser>(1);
  currentUser$ = this.currentUserSource.asObservable();
  constructor(private http: HttpClient, private router: Router) { }

  loadCurrentUser(token: string) {
    if (token === null) {
      this.currentUserSource.next(null);
      return of(null);
    }

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.get<IUser>(this.baseUrl + 'account', { headers }).pipe(
      map(user => {
        if (user) {
          this.storeSuccess(user);
          return user;
        } else {
          return of(null);
        }
      })
    )
  }

  login(values: any) {
    return this.http.post<IUser>(this.baseUrl + 'account/login', values).pipe(
      map(user => {
        this.storeSuccess(user);
        return user;
      })
    )
  }

  register(values: any) {
    return this.http.post<IUser>(this.baseUrl + 'account/register', values).pipe(
      map(user => {
        this.storeSuccess(user);
        return user;
      })
    )
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUserSource.next(null);
    this.router.navigateByUrl('/');
  }

  checkEmailExists(email: string) {
    return this.http.get<boolean>(this.baseUrl + 'account/emailExists?email=' + email);
  }

  getUserAddress() {
    return this.http.get(this.baseUrl + 'account/address');
  }

  updateUserAddress(address: IAddress) {
    return this.http.put(this.baseUrl + 'account/address', address);
  }

  private storeSuccess(user: IUser) {
    localStorage.setItem('token', user.token);
    this.currentUserSource.next(user);
  }
}
