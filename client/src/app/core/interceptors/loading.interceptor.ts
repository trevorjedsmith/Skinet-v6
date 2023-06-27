import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { delay, finalize } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private spinner: NgxSpinnerService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.includes('emailExists') || (request.method === "POST" && request.url.includes('orders')))
      return next.handle(request);

    this.spinner.show();
    return next.handle(request)
      .pipe(
        delay(1000),
        finalize(() => this.spinner.hide())
      );
  }
}
