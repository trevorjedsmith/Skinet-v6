import { Component, OnInit } from '@angular/core';
import { IProduct } from 'src/app/shared/models/product';
import { ShopService } from '../shop.service';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { BasketService } from 'src/app/basket/basket.service';
import { take } from 'rxjs/operators';
import { IBasket } from 'src/app/shared/models/basket';

@Component({
  selector: 'app-shop-details',
  templateUrl: './shop-details.component.html',
  styleUrls: ['./shop-details.component.scss']
})
export class ShopDetailsComponent implements OnInit {
  product: IProduct;
  quantity = 1;
  quantityInBasket = 0;
  constructor(private shopService: ShopService, private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService, private basketService: BasketService) {
    this.breadcrumbService.set('@productDetails', 'Product loading...');
  }

  ngOnInit(): void {
    this.getProduct();
  }

  getProduct() {
    const id = +this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.shopService.getProduct(+this.activatedRoute.snapshot.paramMap.get('id')).subscribe((product: IProduct) => {
        this.product = product;
        this.breadcrumbService.set('@productDetails', this.product.name);
        // easy way to unsubscribe is to pipe and take 1
        this.basketService.basketSource$.pipe(take(1)).subscribe((basket: IBasket) => {
          const item = basket?.items.find(x => x.id == id);
          if (item) {
            // We are synching the item quantities from the basket and the product
            // if there is no item means we dont have a basket and quantity stays 1
            this.quantity = item.quantity;
            this.quantityInBasket = item.quantity;
          }
        })
      }, error => console.log(error))
    }
  }

  incrementQuantity() {
    this.quantity++;
  }

  decrementQuantity() {
    if (this.quantity > 0)
      this.quantity--;
  }

  updateBasket() {
    if (this.product) {
      if (this.quantity > this.quantityInBasket) {
        const itemsToAdd = this.quantity - this.quantityInBasket;
        this.quantityInBasket += itemsToAdd;
        this.basketService.addItemToBasket(this.product, itemsToAdd);
      } else {
        const itemsToRemove = this.quantityInBasket - this.quantity;
        this.quantityInBasket -= itemsToRemove;
        this.basketService.removeItemFromBasket(this.product.id, itemsToRemove);
      }
    }
  }

  get buttonText() {
    return this.quantityInBasket === 0 ? 'Add to basket' : 'Update basket';
  }

}
