import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPagination } from '../shared/models/pagination';
import { IBrand, IProduct, IType } from '../shared/models/product';
import { Observable, of } from 'rxjs';
import { ShopParams } from '../shared/models/shopParams';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl = environment.apiUrl;
  products: IProduct[] = [];
  brands: IBrand[] = [];
  types: IType[] = [];
  pagination?: IPagination<IProduct[]>;
  shopParams = new ShopParams();
  productCache = new Map<string, IPagination<IProduct[]>>();
  constructor(private http: HttpClient) { }

  getKey() {
    console.log('Get key');
    console.log(Object.values(this.shopParams).join('-'));
    return Object.values(this.shopParams).join('-');
  }

  getProducts(useCache = true): Observable<IPagination<IProduct[]>> {
    // if we invalidate cache by passing in false lets blow the map away
    if (!useCache) this.productCache = new Map();

    if (this.productCache.size > 0 && useCache) {
      if (this.productCache.has(this.getKey())) {
        this.pagination = this.productCache.get(this.getKey());
        return of(this.pagination);
      }
    }

    let params = new HttpParams();

    if (this.shopParams && this.shopParams.brandId > 0) params = params.append('brandId', this.shopParams.brandId.toString());
    if (this.shopParams && this.shopParams.typeId > 0) params = params.append('typeId', this.shopParams.typeId.toString());
    if (this.shopParams && this.shopParams.sort) params = params.append('sort', this.shopParams.sort);
    if (this.shopParams && this.shopParams.pageNumber) params = params.append('pageIndex', this.shopParams.pageNumber.toString());
    if (this.shopParams && this.shopParams.pageSize) params = params.append('pageSize', this.shopParams.pageSize.toString());
    if (this.shopParams && this.shopParams.search) params = params.append('search', this.shopParams.search.toString());

    return this.http.get<IPagination<IProduct[]>>(this.baseUrl + 'products', { params }).pipe(
      map(response => {
        // So we need to keep adding cached entries to products
        this.productCache.set(this.getKey(), response);
        this.pagination = response;
        return response;
      })
    )
  }

  setShopParams(params: ShopParams) {
    this.shopParams = params;
  }

  getShopParams() {
    return this.shopParams;
  }

  getProduct(id: number) {
    const product = [...this.productCache.values()].reduce((acc, paginatedResult) => {
      return { ...acc, ...paginatedResult.data.find(x => x.id == id) }
    }, {} as IProduct);

    if(Object.keys(product).length != 0) return of(product);

    return this.http.get<IProduct>(this.baseUrl + 'products/' + id);
  }

  getBrands(): Observable<IBrand[]> {
    if (this.brands.length > 0) return of(this.brands);
    return this.http.get<IBrand[]>(this.baseUrl + 'products/brands').pipe(map(brands => {
      this.brands = brands;
      return brands;
    }))
  }

  getTypes(): Observable<IType[]> {
    if (this.types.length > 0) return of(this.types);
    return this.http.get<IType[]>(this.baseUrl + 'products/types').pipe(map(types => {
      this.types = types;
      return types;
    }))
  }
}
