import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPagination } from '../shared/models/pagination';
import { IBrand, IProduct, IType } from '../shared/models/product';
import { Observable } from 'rxjs';
import { ShopParams } from '../shared/models/shopParams';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl = 'https://localhost:5001/api/';

  constructor(private http: HttpClient) { }

  getProducts(shopParams: ShopParams): Observable<IPagination<IProduct>> {
    let params = new HttpParams();

    if (shopParams && shopParams.brandId > 0) params = params.append('brandId', shopParams.brandId.toString());
    if (shopParams && shopParams.typeId > 0) params = params.append('typeId', shopParams.typeId.toString());
    if (shopParams && shopParams.sort) params = params.append('sort', shopParams.sort);
    if (shopParams && shopParams.pageNumber) params = params.append('pageIndex', shopParams.pageNumber.toString());
    if (shopParams && shopParams.pageSize) params = params.append('pageSize', shopParams.pageSize.toString());
    if (shopParams && shopParams.search) params = params.append('search', shopParams.search.toString());

    return this.http.get<IPagination<IProduct>>(this.baseUrl + 'products', { params });
  }

  getBrands(): Observable<IBrand[]> {
    return this.http.get<IBrand[]>(this.baseUrl + 'products/brands');
  }

  getTypes(): Observable<IType[]> {
    return this.http.get<IType[]>(this.baseUrl + 'products/types');
  }
}
