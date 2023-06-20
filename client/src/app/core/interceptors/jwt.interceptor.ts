import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';
import { take } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  token?: string;
  constructor(private accountService: AccountService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      console.log('1) Getting token from subscription');
      this.token = user?.token;
    });
    if (this.token) {
      console.log('2) Setting token in header')
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.token}`
        }
      })
    }
    return next.handle(request);
  }
}
