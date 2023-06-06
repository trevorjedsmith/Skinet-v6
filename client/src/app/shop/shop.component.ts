import { Component, OnInit } from '@angular/core';
import { IBrand, IProduct, IType } from '../shared/models/product';
import { ShopService } from './shop.service';
import { ShopParams } from '../shared/models/shopParams';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  products: IProduct[] = [];
  brands: IBrand[] = [];
  types: IType[] = [];
  shopParams: ShopParams;
  totalCount = 0;

  sortOptions = [
    { name: 'Alphabetical', value: 'name' },
    { name: 'Price: Low to high', value: 'priceAsc' },
    { name: 'Price: High to low', value: 'priceDesc' },
  ];

  constructor(private shopService: ShopService) { }

  ngOnInit(): void {
    this.getProductsWithBrandsAndTypes();
    this.shopParams = new ShopParams();
  }

  getProductsWithBrandsAndTypes(): void {
    this.getProducts();
    this.getBrands();
    this.getTypes();
  }

  getProducts(): void {
    this.shopService.getProducts(this.shopParams).subscribe((response) => {
      this.products = response.data;
      this.shopParams.pageNumber = response.pageIndex;
      this.shopParams.pageSize = response.pageSize;
      this.totalCount = response.count;
    }, error => console.error(error));
  }

  getBrands(): void {
    this.shopService.getBrands().subscribe((response) => {
      this.brands = [{ id: 0, name: 'All' }, ...response];
    }, error => console.error(error));
  }

  getTypes(): void {
    this.shopService.getTypes().subscribe((response) => {
      this.types = [{ id: 0, name: 'All' }, ...response];
    }, error => console.error(error));
  }

  onBrandSelected(brandId: number) {
    this.shopParams.pageNumber = 1;
    this.shopParams.brandId = brandId;
    this.getProducts();
  }

  onTypeSelected(typeId: number) {
    this.shopParams.pageNumber = 1;
    this.shopParams.typeId = typeId;
    this.getProducts();
  }

  onSortSelected($event: any) {
    this.shopParams.sort = $event.target.value;
    this.getProducts();
  }

  onPageChanged($event: number): void {
    if ($event != this.shopParams.pageNumber) {
      this.shopParams.pageNumber = $event;
      this.getProducts();
    }
  }

}
