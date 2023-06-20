import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Basket, IBasket, IBasketItem, IBasketTotals } from '../shared/models/basket';
import { HttpClient } from '@angular/common/http';
import { IProduct } from '../shared/models/product';
import { IDeliveryMethod } from '../shared/models/deliveryMethod';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  baseUrl = environment.apiUrl;
  // Basket Subject
  private basketSource = new BehaviorSubject<IBasket>(null);
  basketSource$ = this.basketSource.asObservable();

  // Totals subject
  private basketTotalSource = new BehaviorSubject<IBasketTotals>(null);
  basketTotalSource$ = this.basketTotalSource.asObservable();

  shipping = 0;

  constructor(private http: HttpClient) { }

  setShippingPrice(dm: IDeliveryMethod) {
    this.shipping = dm.price;
    this.calculateTotals();
  }

  getBasket(id: string) {
    return this.http.get<IBasket>(this.baseUrl + 'basket?id=' + id).subscribe((basket: IBasket) => {
      this.basketSource.next(basket);
      this.calculateTotals();
    })
  }

  setBasket(basket: IBasket) {
    return this.http.post<IBasket>(this.baseUrl + 'basket', basket).subscribe((basket: IBasket) => {
      this.basketSource.next(basket);
      this.calculateTotals();
    })
  }

  getCurrentBasketValue() {
    return this.basketSource.value;
  }

  addItemToBasket(item: IProduct | IBasketItem, quantity = 1) {
    let itemToAdd: IBasketItem;
    if (this.isProduct(item))
      itemToAdd = this.mapProductToBasketItem(item);
    else
      itemToAdd = item;

    const basket = this.getCurrentBasketValue() ?? this.createBasket();
    basket.items = this.addOrUpdateItem(basket.items, itemToAdd, quantity);
    this.setBasket(basket);
  }

  removeItemFromBasket(id: number, quantity = 1) {
    const basket = this.getCurrentBasketValue();
    if (!basket) return;
    const item = basket.items.find(x => x.id === id);
    if (item) {
      item.quantity -= quantity;
      if (item.quantity === 0) {
        // if there is no item filter it out the list
        basket.items = basket.items.filter(x => x.id !== id);
      }
      if (basket.items.length > 0) this.setBasket(basket);
      else this.deleteBasket(basket);
    }
  }

  private deleteBasket(basket: IBasket) {
    return this.http.delete(this.baseUrl + 'basket?id=' + basket.id).subscribe(() => {
      this.deleteLocalBasket();
    })
  }

  deleteLocalBasket() {
    this.basketSource.next(null);
    this.basketTotalSource.next(null);
    localStorage.removeItem('basket_id');
  }

  private addOrUpdateItem(items: IBasketItem[], itemToAdd: IBasketItem, quantity: number): IBasketItem[] {
    const item = items.find(x => x.id == itemToAdd.id);
    if (item) item.quantity += quantity;
    else {
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    }
    return items;
  }

  private createBasket(): IBasket {
    const basket = new Basket();
    localStorage.setItem('basket_id', basket.id);
    return basket;
  }

  private mapProductToBasketItem(item: IProduct): IBasketItem {
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      quantity: 0,
      pictureUrl: item.pictureUrl,
      brand: item.productBrand,
      type: item.productType
    }
  }

  private calculateTotals() {
    const basket = this.getCurrentBasketValue();
    if (!basket) return;
    const subtotal = basket.items.reduce((sum, current) => (current.price * current.quantity) + sum, 0);
    const total = subtotal + this.shipping;
    this.basketTotalSource.next({ shipping: this.shipping, subtotal, total });
  }

  private isProduct(item: IProduct | IBasketItem): item is IProduct {
    return (item as IProduct).productBrand !== undefined;
  }
}
