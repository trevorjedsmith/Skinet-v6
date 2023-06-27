import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IBrand, IProduct, IType } from '../shared/models/product';
import { ShopService } from './shop.service';
import { ShopParams } from '../shared/models/shopParams';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  @ViewChild('search') searchTerm?: ElementRef;
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
    this.shopParams = this.shopService.getShopParams();
  }

  getProductsWithBrandsAndTypes(): void {
    this.getProducts();
    this.getBrands();
    this.getTypes();
  }

  getProducts(): void {
    this.shopService.getProducts().subscribe((response) => {
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
    const params = this.shopService.getShopParams();
    params.pageNumber = 1;
    params.brandId = brandId;
    this.shopService.setShopParams(params);
    this.getProducts();
  }

  onTypeSelected(typeId: number) {
    const params = this.shopService.getShopParams();
    params.pageNumber = 1;
    params.typeId = typeId;
    this.shopService.setShopParams(params);
    this.getProducts();
  }

  onSortSelected($event: any) {
    const params = this.shopService.getShopParams();
    params.sort = $event.target.value;
    this.shopService.setShopParams(params);
    this.getProducts();
  }

  onPageChanged($event: number): void {
    if ($event != this.shopParams.pageNumber) {
      const params = this.shopService.getShopParams();
      params.pageNumber = $event;
      this.shopService.setShopParams(params);
      this.getProducts();
    }
  }

  onSearch() {
    if (this.searchTerm.nativeElement.value) {
      const params = this.shopService.getShopParams();
      params.pageNumber = 1;
      params.search = this.searchTerm.nativeElement.value;
      this.shopService.setShopParams(params);
      this.getProducts();
    }
  }

  onReset() {
    if (this.searchTerm) this.searchTerm.nativeElement.value = '';
    this.shopParams = new ShopParams();
    this.shopService.setShopParams(this.shopParams);
    this.getProducts();
  }
}
