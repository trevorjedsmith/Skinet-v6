import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BasketService } from 'src/app/basket/basket.service';
import { IProduct } from 'src/app/shared/models/product';

@Component({
  selector: 'app-shop-item',
  templateUrl: './shop-item.component.html',
  styleUrls: ['./shop-item.component.scss']
})
export class ShopItemComponent implements OnInit {
  @Input() product: IProduct;
  constructor(private basketService: BasketService, private router: Router) { }

  ngOnInit(): void {
  }

  addItemToBasket() {
    if (this.product)
      this.basketService.addItemToBasket(this.product, 1);
  }

}
