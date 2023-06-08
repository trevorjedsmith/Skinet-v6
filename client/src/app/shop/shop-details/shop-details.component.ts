import { Component, OnInit } from '@angular/core';
import { IProduct } from 'src/app/shared/models/product';
import { ShopService } from '../shop.service';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-shop-details',
  templateUrl: './shop-details.component.html',
  styleUrls: ['./shop-details.component.scss']
})
export class ShopDetailsComponent implements OnInit {
  product: IProduct;
  constructor(private shopService: ShopService, private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService) {
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
      }, error => console.log(error))
    }
  }

}
