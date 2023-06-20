import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IDeliveryMethod } from '../shared/models/deliveryMethod';
import { map } from 'rxjs/operators';
import { IOrderToCreate } from '../shared/models/order';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getDeliveryMethods() {
    // const token = localStorage.getItem('token');
    // let headers = new HttpHeaders();
    // headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http.get<IDeliveryMethod[]>(this.baseUrl + 'orders/delivery-methods').pipe(
      map(dm => {
        return dm.sort((a, b) => b.price - a.price);
      })
    )
  }

  createOrder(order: IOrderToCreate) {
    return this.http.post(this.baseUrl + 'orders', order);
  }
}
