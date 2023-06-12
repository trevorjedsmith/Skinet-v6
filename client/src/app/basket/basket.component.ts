import { Component, OnInit } from '@angular/core';
import { BasketService } from './basket.service';
import { IBasketItem } from '../shared/models/basket';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {

  constructor(public basketService: BasketService) { }

  ngOnInit(): void {
  }

  incrementQuantity(item: IBasketItem) {
    this.basketService.addItemToBasket(item);
  }

  decrementQuantity(id: number, quantity: number) {
    this.basketService.removeItemFromBasket(id, quantity);
  }

}
