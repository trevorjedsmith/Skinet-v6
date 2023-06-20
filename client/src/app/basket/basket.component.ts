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

  onAddItem(item: IBasketItem) {
    this.basketService.addItemToBasket(item);
  }

  onRemoveItem($event: { id: number, quantity: number }) {
    this.basketService.removeItemFromBasket($event.id, $event.quantity);
  }

}
